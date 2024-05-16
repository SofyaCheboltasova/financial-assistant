import numpy as np, csv
from sentence_transformers import SentenceTransformer, util
from rank_bm25 import BM25Okapi

model_id = 'intfloat/multilingual-e5-base'
model = SentenceTransformer(model_id) 

def DenseRetriever(query, vectors):
    top_k = 20
    vec_query = model.encode(query, normalize_embeddings=True)
    sim = util.pytorch_cos_sim(vec_query, vectors)[0]    
    top_indices = np.argsort(-sim)[:top_k].tolist()
        
    return top_indices

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
    top_results = bm25.get_top_n(tokenized_query, tokenized_corpus, n=20)
    top_indices = [int(text[0]) for text in top_results]
    
    return top_indices