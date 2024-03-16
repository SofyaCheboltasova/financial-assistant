from django.http import JsonResponse
from .models import Bank, BankLoanDetail, BankLoanSubsection, LoanDetailedDescription, FinancialProduct, ProductCategories

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
    
def get_loan_subsection(request):
    if 'category_id' in request.GET:
        category_id = request.GET['category_id']
        subsections = BankLoanSubsection.objects.filter(category_id=category_id)
        data = [{'id': subsection.id, 'nameRus': subsection.titleRus, 'nameEng': subsection.titleEng} for subsection in subsections]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Category id are required.'}, status=400)
    
def get_subsection_detail(request):
    if 'subsection_id' in request.GET:
        subsection_id = request.GET['subsection_id']
        details = BankLoanDetail.objects.filter(subsection_id=subsection_id)
        data = [{'id': detail.id, 'nameRus': detail.title} for detail in details]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Subsection id are required.'}, status=400)
    
def get_detailed_description(request):
    if 'loanDetail_id' in request.GET:
        loanDetail_id = request.GET['loanDetail_id']
        details = LoanDetailedDescription.objects.filter(loanDetail_id=loanDetail_id)
        data = [{'id': detail.id, 'title': detail.title, 'description': detail.description, 'link': detail.link} for detail in details]
        return JsonResponse(data, safe=False)
    else:
        return JsonResponse({'error': 'Subsection detail id is required.'}, status=400)
