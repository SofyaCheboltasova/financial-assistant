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
