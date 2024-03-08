from django.http import JsonResponse
from .models import Bank, FinancialProduct, ProductCategories

def get_banks(request):
    banks = Bank.objects.all()
    data = [{'id': bank.id, 'nameRus': bank.nameRus, 'nameEng': bank.nameEng, } for bank in banks]
    return JsonResponse(data, safe=False)

def get_financial_products(request):
    financial_products = FinancialProduct.objects.all()
    data = [{'id': product.id, 'nameRus': product.nameRus, 'nameEng': product.nameEng} for product in financial_products]
    return JsonResponse(data, safe=False)


def get_product_categories(request):
    if 'bank_id' in request.GET and 'product_id' in request.GET:
        bank_id = request.GET['bank_id']
        product_id = request.GET['product_id']
        categories = ProductCategories.objects.filter(bank_id=bank_id, product_id=product_id)
        data = [{'id': category.id, 'nameRus': category.categoryNameRus, 'nameEng': category.categoryNameEng} for category in categories]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Bank id and Product id are required.'}, status=400)
