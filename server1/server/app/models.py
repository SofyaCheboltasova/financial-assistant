from django.db import models
class Bank(models.Model):
    nameRus = models.CharField(max_length=255)
    nameEng = models.CharField(max_length=255)
    def __str__(self):
        return self.nameEng
    
		
class FinancialProduct(models.Model):
    nameRus = models.CharField(max_length=255)
    nameEng = models.CharField(max_length=255)

    def __str__(self):
        return self.nameEng

class ProductCategories(models.Model):
    bank_id = models.ForeignKey(Bank, on_delete=models.CASCADE)
    product_id = models.ForeignKey(FinancialProduct, on_delete=models.CASCADE)
    categoryNameRus = models.CharField(max_length=255)
    categoryNameEng = models.CharField(max_length=255)

    def __str__(self):
        return self.categoryNameEng

