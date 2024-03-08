from django.urls import path
from . import views

urlpatterns = [
    path('banks/', views.get_banks, name='banks'),
    path('financial-products/', views.get_financial_products, name='financial_products'),
    path('products-categories/', views.get_product_categories, name='products_categories'),
]