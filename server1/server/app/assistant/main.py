from django.http import JsonResponse
from . import preprocessing, namedEntities, dataLoader, ranker, retrievers

def main(request):
    query = request.GET.get('q')
    preprocessed_query = preprocessing.preprocessing(query)
    lemmas = preprocessed_query.split(' ')
    bank_id, product_id = namedEntities.determine_bank_product(lemmas)
    
    prepocessed_db_texts, filtered_indices = dataLoader.get_db_texts(bank_id, product_id)
    filtered_dense_vectors = dataLoader.load_dense_vectors(filtered_indices)
  
    topK_dense_vectors_ids = retrievers.DenseRetriever(preprocessed_query, filtered_dense_vectors)  
    topK_sparse_vectors_ids = retrievers.SparseRetriever(preprocessed_query, filtered_indices)
    
    ranked_ids = ranker.rankTexts(topK_dense_vectors_ids, topK_sparse_vectors_ids)
    ranked_texts = dataLoader.load_texts_by_indices(prepocessed_db_texts, ranked_ids)

    for text in ranked_texts:
      bank, category, title, description, link = text.split('|')
      response_data = {
        "bank": bank,
        "category": category,
        "title": title,
        "answer": description,
        "link": link
      }
      return JsonResponse(response_data)   

