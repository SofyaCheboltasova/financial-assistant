from django.http import JsonResponse

# from .views import db_texts, index
from .models import Bank, FinancialProduct, LoanDetailedDescription, ProductCategories

import pickle
from django.shortcuts import get_object_or_404
import pymorphy2
import nltk
nltk.download('punkt')
nltk.download('wordnet')
nltk.download('stopwords')
nltk.download('averaged_perceptron_tagger_ru')
from nltk.corpus import stopwords

from transformers import BertModel, BertForQuestionAnswering, BertTokenizer
import numpy as np

import faiss
index = faiss.IndexIDMap(faiss.IndexFlatIP(768))

import torch
import pickle


# обработать случаи, когда пишут tinkoff тинькове / сбере и тд 

def get_banks():
    banks = Bank.objects.all()
    return banks

def determine_bank(lemmas):
    banks = get_banks()
    
    for bank in banks:
        for lemma in lemmas:
            if lemma.lower() == bank.nameRus.lower():
                return bank
            
    for bank in banks:
        for lemma in lemmas:
            if lemma.lower() == bank.nameEng.lower():
                return bank
    return None

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
        parsed_word = morph.parse(word)[0]  # Получаем первый разбор слова
        inflected_word = parsed_word.inflect({'nomn'})
        nominative_word = inflected_word.word if inflected_word else word 
        nominative_words.append(nominative_word)
    return nominative_words


def get_financial_products():
    financial_products = FinancialProduct.objects.all()
    return financial_products


def determine_financial_product(lemmas):
    products = get_financial_products()
    
    for product in products:
        for lemma in lemmas:
            if lemma.lower() in product.nameRus.lower() or lemma.lower() in product.nameEng.lower():
                return product
                
    return None


def determine_category(bank_id, product_id, lemmas):
    categories = ProductCategories.objects.filter(bank_id=bank_id, product_id=product_id).order_by('id')
    

# Как изменится ставка, если отказаться от программы страховой защиты после оформления кредита под залог недвижимости?
def vectorize(text):
    tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
    model = BertModel.from_pretrained('bert-base-uncased')
    inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
    outputs = model(**inputs)
    return outputs.last_hidden_state.detach().numpy()[0]


def indexing(db_texts, index_file="faiss_index.pkl"):
    try:
        with open(index_file, 'rb') as f:
            index = pickle.load(f)
            print('Индекс успешно загружен из файла.')

    except (FileNotFoundError, EOFError):
        print('Создание нового индекса...')

        index = faiss.IndexFlatIP(768)
        vectors = [vectorize(text) for text in db_texts]
        vectors = torch.nn.utils.rnn.pad_sequence([torch.from_numpy(v) for v in vectors], batch_first=True, padding_value=0.0)
        vectors = vectors.reshape(vectors.size(0), -1)

        if vectors.size(1) != 768:
            vectors = vectors[:, :768]
        vectors = vectors.numpy()
        index.add(vectors)
        
        with open(index_file, 'wb') as f:
            pickle.dump(index, f)
            print('Индекс успешно сохранен в файл.')
    
    return index

    
def find_relevants(user_query, db_texts, index):
    query_vector = vectorize(user_query)
    
    if len(query_vector) != 768:
        if len(query_vector) < 768:
            query_vector = np.pad(query_vector, (0, 768 - len(query_vector)), mode='constant')
        else:
            query_vector = query_vector[:768]
  
    query_vector = query_vector.reshape(1, -1)

    result = index.search(query_vector, k=5)
    
    distances = result[0][0]  
    indices = result[1][0] 
    relevant_texts = [db_texts[i] for i in indices]
    return relevant_texts


def get_answer(relevant_texts, user_query): 
    model = BertForQuestionAnswering.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')
    tokenizer = BertTokenizer.from_pretrained('bert-large-uncased-whole-word-masking-finetuned-squad')
    
    for text in relevant_texts:
      inputs = tokenizer(user_query, text, return_tensors="pt", truncation="only_second")
      outputs = model(**inputs)
      answer_start = torch.argmax(outputs.start_logits)
      answer_end = torch.argmax(outputs.end_logits) + 1
      answer = tokenizer.convert_tokens_to_string(tokenizer.convert_ids_to_tokens(inputs["input_ids"][0][answer_start:answer_end]))
      print('lalala')
      if answer:
        print(f"Ответ: {answer}")
        break

def search(query, model, index, data):
   query_vector = model.encode([query])
   k = 10
   top_k = index.search(query_vector, k)
   return [data[_id] for _id in top_k[1].tolist()[0]]
      

from sentence_transformers import SentenceTransformer
sentence_transform_model = SentenceTransformer('distilbert-base-nli-mean-tokens')

from sklearn.neighbors import NearestNeighbors
nbrs = NearestNeighbors(n_neighbors=20, metric='cosine')

from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("DeepPavlov/rubert-base-cased-sentence")
auto_model = AutoModel.from_pretrained("DeepPavlov/rubert-base-cased-sentence")


def get_request_embeddings(texts):
    encoded_input = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors='pt')
    with torch.no_grad():
      output = auto_model(**encoded_input)
    embeddings = output.last_hidden_state[:, 0, :]
    return embeddings


def get_text_embeddings(texts, index_file="faiss_index.pkl"):
    try:
        with open(index_file, 'rb') as f:
            text_embeddings = pickle.load(f)
    except (FileNotFoundError, EOFError):
        encoded_input = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors='pt')
        with torch.no_grad():
            output = auto_model(**encoded_input)
            embeddings = output.last_hidden_state[:, 0, :]
        text_embeddings = dict(zip(texts, embeddings))
        with open(index_file, 'wb') as f:
            pickle.dump(text_embeddings, f)

    text_tensor = torch.stack([text_embeddings[text] for text in texts])
    return text_tensor

def get_db_texts():
    loan_descriptions = LoanDetailedDescription.objects.all()
    db_texts = [description.description for description in loan_descriptions]
    return db_texts


def find_relevant_texts(user_query, db_embeddings, data):
    query_embedding = get_request_embeddings([user_query])
    query_tensor = torch.tensor(query_embedding[0]).clone().detach()
    scores = torch.mv(db_embeddings, query_tensor)
    sorted_indices = scores.argsort(descending=True)
    relevant_texts = [data[i] for i in sorted_indices[:20]]
    return relevant_texts



def get_loan_rate(request):
    query = request.GET.get('q')
    data = get_db_texts()
    db_embeddings = get_text_embeddings(data)
    relevant_texts = find_relevant_texts(query, db_embeddings, data)
    
    encoded_filtered_data = sentence_transform_model.encode(relevant_texts)
    nbrs.fit(encoded_filtered_data)
    query_vector = sentence_transform_model.encode([query])
    distances, indices = nbrs.kneighbors(query_vector)
    relevant_texts1 = [relevant_texts[i] for i in indices[0]]

    for i, text in enumerate(reversed(relevant_texts1)):
      # print(i, 'NEIGHBOORS: ', text, '\n')
      if i == 0: 
        response_data = {
          "data": text
    	}
      if i == 5:
        break
    
    return JsonResponse(response_data)

    # for i, text in enumerate(reversed(relevant_texts1)):
    #     print(i, 'NEIGHBOORS: ', text, '\n')
    #     if i == 5:
    #         break

    # tokens = nltk.word_tokenize(query)
    # lemmas = filter_lemmas(tokens)
    
    # bank = determine_bank(lemmas)
    # if bank: lemmas.remove(bank.nameRus)
        
    # nom_lemmas = to_nominative_case(lemmas)
    # product = determine_financial_product(nom_lemmas)
  
    # bank_id = bank.id
    # product_id = product.id