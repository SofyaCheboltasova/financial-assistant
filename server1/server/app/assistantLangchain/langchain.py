from django.http import JsonResponse
from langchain.retrievers import EnsembleRetriever
from langchain_community.retrievers import BM25Retriever
from langchain_community.vectorstores import FAISS
from langchain_community.embeddings import HuggingFaceEmbeddings
import os

from sentence_transformers import SentenceTransformer
from ..assistant import preprocessing, namedEntities, dataLoader

model_id = 'intfloat/multilingual-e5-base'
model = SentenceTransformer(model_id) 

def get_preprocessed_texts(query): 
    preprocessed_query =  preprocessing.preprocessing(query)
    lemmas = preprocessed_query.split(' ')
    bank_id, product_id = namedEntities.determine_bank_product(lemmas)
    prepocessed_db_texts, indicies = dataLoader.get_db_texts(bank_id, product_id)
    
    return prepocessed_db_texts


def get_faiss_vectorstore(prepocessed_db_texts):
    embedding = HuggingFaceEmbeddings(model_name=model_id)
    if os.path.exists('faiss_index'):
        faiss_vectorstore = FAISS.load_local('faiss_index', embeddings=embedding, allow_dangerous_deserialization=True)
    else:
        faiss_vectorstore = FAISS.from_texts(prepocessed_db_texts, embedding)
        faiss_vectorstore.save_local('faiss_index')
    return faiss_vectorstore


def init_retrievers(prepocessed_db_texts, faiss_vectorstore):
    bm25_retriever = BM25Retriever.from_texts(prepocessed_db_texts)
    bm25_retriever.k = 5
    faiss_retriever = faiss_vectorstore.as_retriever(search_kwargs={"k": 5})
    
    return bm25_retriever, faiss_retriever


def main(request):
    query = request.GET.get('q')    
    
    prepocessed_db_texts = get_preprocessed_texts(query)
    faiss_vectorstore = get_faiss_vectorstore(prepocessed_db_texts) 
    
    bm25_retriever, faiss_retriever = init_retrievers(prepocessed_db_texts, faiss_vectorstore)    
    ensemble_retriever = EnsembleRetriever(
        retrievers=[bm25_retriever, faiss_retriever], weights=[0.4, 0.6]
    )
    
    results = ensemble_retriever.get_relevant_documents(query, return_source_documents=True)
    
    for result in results:
      bank, category, title, description, link = result.to_json().get('kwargs').get('page_content').split('|')
      response_data = {
        "bank": bank,
        "category": category,
        "title": title,
        "answer": description,
        "link": link
      }
      return JsonResponse(response_data)  