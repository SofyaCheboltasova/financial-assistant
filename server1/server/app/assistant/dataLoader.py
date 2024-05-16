import csv, numpy as np
from sentence_transformers import SentenceTransformer
from ..models import Bank, LoanDetailedDescription, ProductCategories
from .preprocessing import preprocessing

model_id = 'intfloat/multilingual-e5-base'
model = SentenceTransformer(model_id) 
prepocessed_db_texts = []
prepocessed_db_texts_idx = []

def load_db_texts_from_csv(bank_id, product_id, filename='db_texts.csv'):
  db_texts = []
  db_texts_idx = []
  try:
    with open(filename, 'r', encoding='utf-8') as csvfile:
      reader = csv.DictReader(csvfile)
      if bank_id is not None and product_id is not None:
        for idx, row in enumerate(reader):
          if(int(row['bank_id']) == bank_id and int(row['product_id']) == product_id):
            db_texts.append(row['description'])
            db_texts_idx.append(idx)
            
      elif bank_id is not None and product_id is None:
        for idx, row in enumerate(reader):
          if(int(row['bank_id']) == bank_id):
            db_texts.append(row['description'])
            db_texts_idx.append(idx)
            
      elif bank_id is None and product_id is not None:
        for idx, row in enumerate(reader):
          if(int(row['product_id']) == product_id):
            db_texts.append(row['description'])
            db_texts_idx.append(idx)
      else:
         for row in reader:
            db_texts.append(row['description'])
            db_texts_idx.append(idx)
        # db_texts.append(f"{row['bank_id']}|{row['product_id']}|{row['category_id']}|{row['preprocessed']}|{row['description']}")
  except FileNotFoundError:
    pass
  return db_texts, db_texts_idx

def save_db_texts_to_csv(db_texts	, filename='db_texts.csv'):
  with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
    fieldnames = ['bank_id', 'product_id', 'category_id', 'preprocessed', 'description']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
    writer.writeheader()
    for text in db_texts:
      bank_id, product_id, category_id, preprocessed, description = text.split('||')
      writer.writerow({'bank_id': bank_id, 'product_id': product_id, 'category_id': category_id, 'preprocessed': preprocessed, 'description': description})

def get_db_texts(bank_id, product_id):
  global prepocessed_db_texts, prepocessed_db_texts_idx
  
  if not prepocessed_db_texts:
    prepocessed_db_texts, prepocessed_db_texts_idx = load_db_texts_from_csv(bank_id, product_id)
    
    if not prepocessed_db_texts:
      loan_descriptions = LoanDetailedDescription.objects.order_by('id').all()
      
      for desc in loan_descriptions:
         bank = Bank.objects.get(id=desc.bank_id_id).nameRus.lower()
         category = ProductCategories.objects.get(id=desc.category_id_id).categoryNameRus.lower()
         title = desc.title.lower()  
         description = desc.description
         link = desc.link
         preprocessed = preprocessing(f"{description}")

         prepocessed_db_texts.append(f"{desc.bank_id_id}||{desc.product_id_id}||{desc.category_id_id}||{preprocessed}||{bank}|{category}|{title}|{description}|{link}") 
         
      save_db_texts_to_csv(prepocessed_db_texts)
      prepocessed_db_texts, prepocessed_db_texts_idx = load_db_texts_from_csv(bank_id, product_id)
  return prepocessed_db_texts, prepocessed_db_texts_idx

def load_dense_vectors(indexies):
    try:
        vecs_texts = np.load('dense_vectors.npy')
    except FileNotFoundError:
        preprocessed_texts = []
        with open('db_texts.csv', 'r', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                preprocessed_texts.append(row['preprocessed'])

        vecs_texts = model.encode(preprocessed_texts, normalize_embeddings=True)
        np.save('dense_vectors.npy', vecs_texts) 
    
    return vecs_texts[indexies]

def load_texts_by_indices(db_texts, indices):
    topK_texts = [db_texts[int(idx)] for idx in indices if int(idx) < len(db_texts)]
    return topK_texts 