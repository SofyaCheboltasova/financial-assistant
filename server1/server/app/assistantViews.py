import re
from django.http import JsonResponse
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

from sentence_transformers import SentenceTransformer
sentence_transform_model = SentenceTransformer('distilbert-base-nli-mean-tokens')

from sklearn.neighbors import NearestNeighbors
nbrs = NearestNeighbors(n_neighbors=20, metric='cosine')
db_texts = []

from transformers import AutoTokenizer, AutoModel
tokenizer = AutoTokenizer.from_pretrained("DeepPavlov/rubert-base-cased-sentence")
auto_model = AutoModel.from_pretrained("DeepPavlov/rubert-base-cased-sentence")


def get_request_embeddings(texts):
  encoded_input = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors='pt')
  with torch.no_grad():
    output = auto_model(**encoded_input)
  embeddings = output.last_hidden_state[:, 0, :]
  return embeddings


def get_text_embeddings(texts, index_file="faiss_index.pkl", tensor_file="text_tensor.pt"):
  try:
    text_tensor = torch.load(tensor_file)
    print('get embeddings from file')
  except (FileNotFoundError, EOFError):
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
    torch.save(text_tensor, tensor_file)

  return text_tensor


def save_db_texts(db_texts, filename='db_texts.pkl'):
  with open(filename, 'wb') as file:
    pickle.dump(db_texts, file)


def load_db_texts(filename='db_texts.pkl'):
  try:
    with open(filename, 'rb') as file:
      db_texts = pickle.load(file)
  except FileNotFoundError:
    db_texts = []
  return db_texts

def get_db_texts():
  global db_texts
  if not db_texts:
    db_texts = load_db_texts()
    if not db_texts:
      loan_descriptions = LoanDetailedDescription.objects.all()
      # category_details = [description.loanDetail_id for description in loan_descriptions]
      # subsections = [category_detail.subsection_id for category_detail in category_details]
      # categories_id = [subsection.category_id for subsection in subsections]
            
      db_texts = [f"{description.title}\n {description.description}" for description in loan_descriptions]
      save_db_texts(db_texts)
  return db_texts



def find_relevant_texts(user_query, db_embeddings, data):    
  query_embedding = get_request_embeddings([user_query])
  query_tensor = torch.tensor(query_embedding[0]).clone().detach()
  scores = torch.mv(db_embeddings, query_tensor)
  sorted_indices = scores.argsort(descending=True)
  relevant_texts = [data[i] for i in sorted_indices[:20]]

  return relevant_texts


def check_string_match(query, texts):
    query_tokens = nltk.word_tokenize(query)
    query_lemmas = filter_lemmas(query_tokens)
    query_lemmas_str = ' '.join(query_lemmas)
    query_words = set(to_nominative_case(re.findall(r'\w+', query_lemmas_str)))
    match_counts = {}
    
    for text in texts:
      tokens = nltk.word_tokenize(text)
      lemmas = filter_lemmas(tokens)
      lemmas_str = ' '.join(lemmas)
      text_words = set(to_nominative_case(re.findall(r'\w+', lemmas_str)))
      intersection = text_words.intersection(query_words)
      match_counts[text] = len(intersection)
    
    max_matching_texts = [text for text, count in match_counts.items() if count == max(match_counts.values())]
    
    return max_matching_texts[0]

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
  
  answer = check_string_match(query, relevant_texts1)
  response_data = {
    "data": answer
  }

  # relevant_answers = []

  # for i, text in enumerate(reversed(relevant_texts1)):
  #   if i == 0: 
  #     response_data = {
  #       "data": text
  #   	}
  #   relevant_answers.append(text)
  #   print(i, ' : ', text, '\n')
  #   if i == 20: break
    

  return JsonResponse(response_data)

    # tokens = nltk.word_tokenize(query)
    # lemmas = filter_lemmas(tokens)
    
    # bank = determine_bank(lemmas)
    # if bank: lemmas.remove(bank.nameRus)
        
    # nom_lemmas = to_nominative_case(lemmas)
    # product = determine_financial_product(nom_lemmas)
  
    # bank_id = bank.id
    # product_id = product.id