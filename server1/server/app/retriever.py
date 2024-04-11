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
def load_vectors(texts, indexies):
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
def retriever(query, vectors):
    top_k = 10
    vec_query = model.encode(query, convert_to_tensor=True)
    sim = util.pytorch_cos_sim(vec_query, vectors)[0]    
    top_indices = np.argsort(-sim)[:top_k]
      
    return top_indices
   

# 7. Извлечение из бд по массиву   
def load_texts_by_indices(db_texts, indices):
    selected_texts = [db_texts[idx] for idx in indices if idx < len(db_texts)]
    topK_texts = []
    for text in selected_texts:
       answer = text.split('|')
       topK_texts.append(answer[len(answer) - 1])
    return topK_texts


def get_loan_rate(request):
  prepocessed_db_texts = get_db_texts()

  query = request.GET.get('q')
  preprocessed_query = preprocessing(query)  
  
  filtered_indices = filter_texts_by_NE(preprocessed_query, prepocessed_db_texts)
  filtered_vectors = load_vectors(prepocessed_db_texts, filtered_indices)
  
  topK_vectors_ids = retriever(preprocessed_query, filtered_vectors)
  topK_texts = load_texts_by_indices(prepocessed_db_texts, topK_vectors_ids)
  
  for text in topK_texts:
     print(text, '\n\n\n\n\n')
 
  response_data = {
    "data": topK_texts[0]
  }
  return JsonResponse(response_data)  
