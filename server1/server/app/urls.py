from django.urls import path, include
from django.contrib import admin
from django.views.generic import TemplateView
from .views import index

urlpatterns = [
    path('', index),
    path('api/', include('api.urls')), 
    path('admin/', admin.site.urls),
]
