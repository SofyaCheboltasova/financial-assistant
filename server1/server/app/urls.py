from django.urls import path
from . import views

urlpatterns = [
    path('banks/', views.get_banks, name='banks'),
    path('financial-products/', views.get_financial_products, name='financial_products'),
    path('products-categories/', views.get_product_categories, name='products_categories'),
		path('loan-subsections/', views.get_loan_subsection, name='loan_subsection'),
		path('subsection-details/', views.get_subsection_detail, name='subsection_details'),
]