from django.http import JsonResponse
from .models import Bank, FinancialProduct

def get_banks(request):
    banks = Bank.objects.all()
    data = [{'id': bank.id, 'name': bank.name} for bank in banks]
    print(banks)
    return JsonResponse(data, safe=False)

def get_financial_products(request):
    financial_products = FinancialProduct.objects.all()
    data = [{'id': product.id, 'name': product.name} for product in financial_products]
    return JsonResponse(data, safe=False)
