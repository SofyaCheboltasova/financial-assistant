from ..models import Bank, FinancialProduct

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
            text_fields = text.split('||')
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
