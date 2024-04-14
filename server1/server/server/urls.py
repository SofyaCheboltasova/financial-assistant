from django.contrib import admin
from django.urls import path

from app import views, retriever

urlpatterns = [
		# path('/',  views.index, name='index'),
    path('admin/', admin.site.urls),
		path('banks/', views.get_banks, name='banks'),
    path('financial-products/', views.get_financial_products, name='financial_products'),
		path('products-categories/', views.get_product_categories, name='products_categories'),
		path('loan-subsections/', views.get_loan_subsection, name='loan_subsection'),
		path('subsection-details/', views.get_subsection_detail, name='subsection_details'),
		path('detailed-description/', views.get_detailed_description, name='detailed_description'),
		path('get-loan-rate/', retriever.get_loan_rate, name='get_loan_rate'),
]
