from django.http import JsonResponse
from .models import Bank, FinancialProduct

def get_banks(request):
    banks = Bank.objects.all()
    data = [{'id': bank.id, 'nameRus': bank.nameRus, 'nameEng': bank.nameEng, } for bank in banks]
    print(banks)
    return JsonResponse(data, safe=False)

def get_financial_products(request):
    financial_products = FinancialProduct.objects.all()
    data = [{'id': product.id, 'nameRus': product.nameRus, 'nameEng': product.nameEng} for product in financial_products]
    return JsonResponse(data, safe=False)
