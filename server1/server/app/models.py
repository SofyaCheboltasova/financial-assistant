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

