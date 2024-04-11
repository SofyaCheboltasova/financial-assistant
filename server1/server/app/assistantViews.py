# import re
# from django.http import JsonResponse
# from .models import Bank, FinancialProduct, LoanDetailedDescription, ProductCategories

# import pickle
# from django.shortcuts import get_object_or_404
# import pymorphy2
# import nltk
# nltk.download('punkt')
# nltk.download('wordnet')
# nltk.download('stopwords')
# nltk.download('averaged_perceptron_tagger_ru')
# from nltk.corpus import stopwords

# import faiss
# index = faiss.IndexIDMap(faiss.IndexFlatIP(768))

# import torch
# import pickle


# # обработать случаи, когда пишут tinkoff тинькове / сбере и тд 
# # 1. Ключевые слова
# # 2. Эмбеддинги - на предсказаниях пропущенного слова
# # 		он не учился как вопрос ответная система
# # 4. айдишники в feture storах
# # 3. Модели с семантической близостью
	 


# def get_banks():
#     banks = Bank.objects.all()
#     return banks

# def determine_bank(lemmas):
#     banks = get_banks()
    
#     for bank in banks:
#         for lemma in lemmas:
#             if lemma.lower() == bank.nameRus.lower():
#                 return bank
            
#     for bank in banks:
#         for lemma in lemmas:
#             if lemma.lower() == bank.nameEng.lower():
#                 return bank
#     return None

# def filter_lemmas(tokens):
#     stop_words = set(stopwords.words('russian'))
#     tagged_tokens = nltk.pos_tag(tokens, lang='rus')
#     filtered_tokens = [word for word, tag in tagged_tokens if tag not in ['CONJ', 'PR', 'ADV'] and word.lower() not in stop_words]
    
#     lemmas = [nltk.stem.WordNetLemmatizer().lemmatize(t) for t in filtered_tokens]
#     return lemmas

# def to_nominative_case(words):
#     morph = pymorphy2.MorphAnalyzer()
#     nominative_words = []
#     for word in words:
#         parsed_word = morph.parse(word)[0]  # Получаем первый разбор слова
#         inflected_word = parsed_word.inflect({'nomn'})
#         nominative_word = inflected_word.word if inflected_word else word 
#         nominative_words.append(nominative_word)
#     return nominative_words

# def get_financial_products():
#     financial_products = FinancialProduct.objects.all()
#     return financial_products

# def determine_financial_product(lemmas):
#     products = get_financial_products()
    
#     for product in products:
#         for lemma in lemmas:
#             if lemma.lower() in product.nameRus.lower() or lemma.lower() in product.nameEng.lower():
#                 return product
                
#     return None

# def determine_category(bank_id, product_id, lemmas):
#     categories = ProductCategories.objects.filter(bank_id=bank_id, product_id=product_id).order_by('id')
    

# # Как изменится ставка, если отказаться от программы страховой защиты после оформления кредита под залог недвижимости?
# from sentence_transformers import SentenceTransformer, util
# sentence_transform_model = SentenceTransformer('distilbert-base-nli-mean-tokens')

# from sklearn.neighbors import NearestNeighbors
# nbrs = NearestNeighbors(n_neighbors=10, metric='cosine')


# db_texts = []

# from transformers import AutoTokenizer, AutoModel
# tokenizer = AutoTokenizer.from_pretrained("DeepPavlov/rubert-base-cased-sentence")
# auto_model = AutoModel.from_pretrained("DeepPavlov/rubert-base-cased-sentence")

# from pymystem3 import Mystem


# # 1
# def load_db_texts(filename='db_texts.pkl'):
#   try:
#     with open(filename, 'rb') as file:
#       db_texts = pickle.load(file)         
#   except FileNotFoundError:
#     db_texts = []
#   return db_texts

# def save_db_texts(db_texts, filename='db_texts.pkl'):
#   with open(filename, 'wb') as file:
#     pickle.dump(db_texts, file)

# def get_db_texts():
#   global db_texts
#   if not db_texts:
#     db_texts = load_db_texts()
#     if not db_texts:
#       loan_descriptions = LoanDetailedDescription.objects.all()
#       for desc in loan_descriptions:
#          bank = Bank.objects.get(id=desc.bank_id_id).nameRus.lower()
#          product = FinancialProduct.objects.get(id=desc.product_id_id).nameRus.lower()
#          category = ProductCategories.objects.get(id=desc.category_id_id).categoryNameRus.lower()
#          title = desc.title.lower()  
#          description = desc.description  
         
#         #  tokens = nltk.word_tokenize(description)
#         #  lemmas = filter_lemmas(tokens)
#         #  nom_lemmas = to_nominative_case(lemmas)
#         #  desc1 = ' '.join(nom_lemmas)
            
#          db_texts.append(f" {bank} {product} {category} {title}|\n {category} {title} {description}")
         
#       save_db_texts(db_texts)
#   return db_texts


# # 2
# def get_text_embeddings(texts, index_file="faiss_index.pkl", tensor_file="text_tensor.pt"):
#   try:
#     text_tensor = torch.load(tensor_file)
#   except (FileNotFoundError, EOFError):
#     try:
#       with open(index_file, 'rb') as f:
#         text_embeddings = pickle.load(f)
#     except (FileNotFoundError, EOFError):
#       encoded_input = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors='pt')
#       with torch.no_grad():
#         output = auto_model(**encoded_input)
#         embeddings = output.last_hidden_state[:, 0, :]
#         text_embeddings = dict(zip(texts, embeddings))
#       with open(index_file, 'wb') as f:
#         pickle.dump(text_embeddings, f)
        
#     text_tensor = torch.stack([text_embeddings[text] for text in texts])
#     torch.save(text_tensor, tensor_file)

#   return text_tensor

# # 3
# def get_request_embeddings(texts):
#   encoded_input = tokenizer(texts, padding=True, truncation=True, max_length=512, return_tensors='pt')
#   with torch.no_grad():
#     output = auto_model(**encoded_input)
#   embeddings = output.last_hidden_state[:, 0, :]
#   return embeddings


# def find_relevant_texts(user_query, db_embeddings, db_texts):   
#   query_embedding = get_request_embeddings([user_query])
#   query_tensor = torch.tensor(query_embedding[0]).clone().detach()
#   scores = torch.mv(db_embeddings, query_tensor)
#   sorted_indices = scores.argsort(descending=True)
#   relevant_texts = [db_texts[i] for i in sorted_indices[:20]]

#   return relevant_texts

# # 4
# def check_string_match(query, texts):
#     match_counts = {}
    
#     for text in texts:
#       text_words = set(re.findall(r'\w+', text.split('|')[1]))
#       intersection = text_words.intersection(query)
#       match_counts[text] = len(intersection)
#     max_matching_texts = [text for text, count in match_counts.items() if count == max(match_counts.values())]
    
#     return max_matching_texts[0]

# def get_loan_rate(request):
#   query = request.GET.get('q')

#   data = get_db_texts()
#   db_embeddings = get_text_embeddings(data)
#   relevant_texts = find_relevant_texts(query, db_embeddings, data)
      
#   encoded_filtered_data = sentence_transform_model.encode(relevant_texts)
#   nbrs.fit(encoded_filtered_data)
#   query_vector = sentence_transform_model.encode([query])
#   distances, indices = nbrs.kneighbors(query_vector)
#   kneighbors_texts = [relevant_texts[i] for i in indices[0]]
  
#   for text in kneighbors_texts:
#      print('NEIGHBORS: ', text, '\n\n\n\n\n')
  
#   answer = check_string_match(query, kneighbors_texts)
#   response_data = {
#     "data": answer
#   }    

#   return JsonResponse(response_data)

#     # tokens = nltk.word_tokenize(query)
#     # lemmas = filter_lemmas(tokens)
    
#     # bank = determine_bank(lemmas)
#     # if bank: lemmas.remove(bank.nameRus)
        
#     # nom_lemmas = to_nominative_case(lemmas)
#     # product = determine_financial_product(nom_lemmas)
  
#     # bank_id = bank.id
#     # product_id = product.id

# # def retriever(query, vectors):
# #   top_k = 10
# #   model = AutoModel.from_pretrained(model_id)
# #   tokenizer = AutoTokenizer.from_pretrained(model_id)
    
# #   tokens_query = tokenizer(query, return_tensors='pt', padding=True, truncation=True)
# #   with torch.no_grad():
# #     output_query = model(**tokens_query)
# #     vec_query = torch.mean(output_query.last_hidden_state, dim=1).squeeze().detach().cpu().numpy()

# #     sim = np.dot(vec_query, vectors.T) / (
# #       np.linalg.norm(vec_query) * np.linalg.norm(vectors, axis = 1)
# #     )
            
# #     top_indices = np.argsort(sim)[::-1][:top_k]
# #     return top_indices

# # def load_vectors(texts, indexies):
# #     model = AutoModel.from_pretrained(model_id)
# #     tokenizer = AutoTokenizer.from_pretrained(model_id)

# #     try:
# #         vecs_texts = np.load('vecs_texts.npy')
# #     except FileNotFoundError:
# #         preprocessed_texts = []
# #         with open('db_texts.csv', 'r', encoding='utf-8') as csvfile:
# #           reader = csv.DictReader(csvfile)
# #           for row in reader:
# #             preprocessed_texts.append(row['preprocessed'])
            
# #         tokens_texts = tokenizer(preprocessed_texts, return_tensors='pt', padding=True, truncation=True)
# #         with torch.no_grad():
# #             output_texts = model(**tokens_texts)
# #             vecs_texts = torch.mean(output_texts.last_hidden_state, dim=1).squeeze().detach().cpu().numpy()
# #             np.save('vecs_texts.npy', vecs_texts)
# #     return vecs_texts[indexies]