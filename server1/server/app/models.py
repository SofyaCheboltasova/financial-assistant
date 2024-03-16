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

class BankLoanSubsection(models.Model):
    category_id = models.ForeignKey(ProductCategories, on_delete=models.CASCADE)
    titleRus = models.CharField(max_length=1000)
    titleEng = models.CharField(max_length=1000)
    
class BankLoanDetail(models.Model):
    subsection_id = models.ForeignKey(BankLoanSubsection, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    
class LoanDetailedDescription(models.Model):
    loanDetail_id = models.ForeignKey(BankLoanDetail, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.CharField(max_length=10000)
    link = models.CharField(max_length=1000)