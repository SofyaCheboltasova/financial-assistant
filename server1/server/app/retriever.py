from .models import Bank, FinancialProduct, LoanDetailedDescription, ProductCategories
from sentence_transformers import SentenceTransformer, util
from django.http import JsonResponse
from nltk.corpus import stopwords

import numpy as np
import pymorphy2
import nltk
import csv

model_id = 'intfloat/multilingual-e5-small'
model = SentenceTransformer(model_id) 

# 1. Предобработка текстов, сохранение наборов в CSV
prepocessed_db_texts = []

def filter_lemmas(tokens):
    stop_words = set(stopwords.words('russian'))
    tagged_tokens = nltk.pos_tag(tokens, lang='rus')
    filtered_tokens = [word for word, tag in tagged_tokens if tag not in ['CONJ', 'PR', 'ADV'] and word.lower() not in stop_words]
    
    lemmas = [nltk.stem.WordNetLemmatizer().lemmatize(t) for t in filtered_tokens]
    return lemmas

def to_nominative_case(words):
    morph = pymorphy2.MorphAnalyzer()
    nominative_words = []
    for word in words:
        parsed_word = morph.parse(word)[0] 
        inflected_word = parsed_word.inflect({'nomn'})
        nominative_word = inflected_word.word if inflected_word else word 
        nominative_words.append(nominative_word)
    return nominative_words

def preprocessing(string):
  tokens = nltk.word_tokenize(string)
  lemmas = filter_lemmas(tokens)
  nom_lemmas = to_nominative_case(lemmas)
  prepocessed = ' '.join(nom_lemmas)
  return prepocessed

def load_db_texts_from_csv(filename='db_texts.csv'):
  db_texts = []
  try:
    with open(filename, 'r', encoding='utf-8') as csvfile:
      reader = csv.DictReader(csvfile)
      for row in reader:
        db_texts.append(f"{row['bank_id']}|{row['product_id']}|{row['category_id']}|{row['title']}|{row['preprocessed']}|{row['description']}")
  except FileNotFoundError:
    pass
  return db_texts

def save_db_texts_to_csv(db_texts, filename='db_texts.csv'):
  with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['bank_id', 'product_id', 'category_id', 'title', 'preprocessed', 'description']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for text in db_texts:
      bank_id, product_id, category_id, title, preprocessed, description = text.split('|')
      writer.writerow({'bank_id': bank_id, 'product_id': product_id, 'category_id': category_id, 'title': title, 'preprocessed': preprocessed, 'description': description})

def get_db_texts():
  global prepocessed_db_texts
  if not prepocessed_db_texts:
    prepocessed_db_texts = load_db_texts_from_csv()
    
    if not prepocessed_db_texts:
      loan_descriptions = LoanDetailedDescription.objects.order_by('id').all()
      for desc in loan_descriptions:
         title = desc.title.lower()  
         description = desc.description
         preprocessed = preprocessing(f"{title}|{description}")

         prepocessed_db_texts.append(f"{desc.bank_id_id}|{desc.product_id_id}|{desc.category_id_id}|{preprocessed}|{description}") 
         
      save_db_texts_to_csv(prepocessed_db_texts)
      prepocessed_db_texts = load_db_texts_from_csv()

  return prepocessed_db_texts


# 2. Сохранение векторов в файл, загрузка векторов
def load_dense_vectors(indexies):
    try:
        vecs_texts = np.load('vecs_texts.npy')
    except FileNotFoundError:
        preprocessed_texts = []
        with open('db_texts.csv', 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                preprocessed_texts.append(row['preprocessed'])

        vecs_texts = model.encode(preprocessed_texts)
        np.save('vecs_texts.npy', vecs_texts) 
    
    return vecs_texts[indexies]

  
# 4. Поиск именованных сущностей в запросе, фильтрация векторов => получение массива id релевантных текстов
def get_banks_products():
    banks = Bank.objects.all()
    financial_products = FinancialProduct.objects.all()
    return banks, financial_products

def determine_bank_product(lemmas):
    banks, products = get_banks_products()
    
    bank_id = None    
    product_id = None 
    
    for bank in banks:
      for lemma in lemmas:
        if lemma.lower() in bank.nameRus.lower() or lemma.lower() in bank.nameEng.lower():
          bank_id = bank.id
    
    for product in products:
      for lemma in lemmas:
        if lemma.lower() in product.nameRus.lower() or lemma.lower() in product.nameEng.lower():
          product_id = product.id  
		
    return bank_id, product_id

def filter_texts_by_NE(query, texts):
    lemmas = query.split(' ')
    bank_id, product_id = determine_bank_product(lemmas)
    
    filtered_indices = []
    if bank_id is not None and product_id is not None:
        for idx, text in enumerate(texts):
            text_fields = text.split('|')
            if int(bank_id) == int(text_fields[0]) and int(product_id) == int(text_fields[1]):
                filtered_indices.append(idx)

    elif bank_id is not None and product_id is None:
        for idx, text in enumerate(texts):
            text_fields = text.split('|')
            if int(bank_id) == int(text_fields[0]):
                filtered_indices.append(idx)

    elif bank_id is None and product_id is not None:
        for idx, text in enumerate(texts):
            text_fields = text.split('|')
            if int(product_id) == int(text_fields[1]):
                filtered_indices.append(idx)
    
    if not filtered_indices:
        return list(range(len(texts)))
    else: return filtered_indices

# 6. проверка на сходство => получение массива id топК векторов 
def DenseRetriever(query, vectors):
    top_k = 10
    vec_query = model.encode(query, convert_to_tensor=True)
    sim = util.pytorch_cos_sim(vec_query, vectors)[0]    
    top_indices = np.argsort(-sim)[:top_k].tolist()
      
    return top_indices

# 7. Извлечение из бд по массиву   
def load_texts_by_indices(db_texts, indices):
    selected_texts = [db_texts[idx] for idx in indices if idx < len(db_texts)]
    topK_texts = []
    for text in selected_texts:
       answer = text.split('|')
       topK_texts.append(answer[len(answer) - 1])
    return topK_texts


from rank_bm25 import BM25Okapi

def SparseRetriever(query, filtered_indices):
    tokenized_corpus = []
    texts = []
    with open('db_texts.csv', 'r', encoding='utf-8') as csvfile:
      reader = csv.DictReader(csvfile)
      for i, row in enumerate(reader):
        texts.append(f"{i} {row['preprocessed']}")

    for index in filtered_indices:
      tokenized_corpus.append(texts[index].split(' '))


    bm25 = BM25Okapi(tokenized_corpus)
    tokenized_query = query.split(" ")
    top_results = bm25.get_top_n(tokenized_query, tokenized_corpus, n=10)
    
    topK_sparse_vectors_ids = [int(text[0]) for text in top_results]
    return topK_sparse_vectors_ids

def rankTexts(dense_ids, sparse_ids):
    text_ratings = {}
    max_penalty = max(len(dense_ids), len(sparse_ids)) + 1

    for i, text_id in enumerate(dense_ids):
        rating = i + 1 
        if text_id in sparse_ids:
            rating += sparse_ids.index(text_id) + 1 
            rating /= 2 
        else:
            rating += max_penalty 
        text_ratings[text_id] = rating

    for i, text_id in enumerate(sparse_ids):
        if text_id not in text_ratings:
            rating = i + 1 + max_penalty
            text_ratings[text_id] = rating

    sorted_texts = sorted(text_ratings.items(), key=lambda x: x[1])
    return [text_id for text_id, rating in sorted_texts]
     
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

def get_loan_rate(request):
  prepocessed_db_texts = get_db_texts()
  query = request.GET.get('q')
  preprocessed_query = preprocessing(query)
  
  
  bm25_retriever = BM25Retriever.from_texts(prepocessed_db_texts)
  bm25_retriever.k = 10

  embedding = HuggingFaceEmbeddings(model_name=model_id)

  faiss_vectorstore = FAISS.from_texts(prepocessed_db_texts, embedding)
  faiss_retriever = faiss_vectorstore.as_retriever(search_kwargs={"k": 10})
  faiss_vectorstore.save_local('faiss_index')

  ensemble_retriever = EnsembleRetriever(
    retrievers=[bm25_retriever, faiss_retriever], weights=[0.5, 0.5]
  )


  docs = ensemble_retriever.invoke(query)
  print(docs)
  
	# 
  
  filtered_indices = filter_texts_by_NE(preprocessed_query, prepocessed_db_texts)
  filtered_dense_vectors = load_dense_vectors(filtered_indices)
  
  topK_dense_vectors_ids = DenseRetriever(preprocessed_query, filtered_dense_vectors)  
  topK_sparse_vectors_ids = SparseRetriever(preprocessed_query, filtered_indices)
  
  # topK_dense_texts = load_texts_by_indices(prepocessed_db_texts, topK_dense_vectors_ids)
  # topK_sparse_texts = load_texts_by_indices(prepocessed_db_texts, topK_sparse_vectors_ids)
  
  ranked_ids = rankTexts(topK_dense_vectors_ids, topK_sparse_vectors_ids)
  ranked_texts = load_texts_by_indices(prepocessed_db_texts, ranked_ids)
 
  response_data = {
     "data": ranked_texts[0]
  }
  return JsonResponse(response_data)  
