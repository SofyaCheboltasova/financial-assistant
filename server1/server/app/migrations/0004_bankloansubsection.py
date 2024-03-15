# Generated by Django 4.2.7 on 2024-03-15 12:33

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0003_rename_bank_productcategories_bank_id_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='BankLoanSubsection',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titleRus', models.CharField(max_length=1000)),
                ('titleEng', models.CharField(max_length=1000)),
                ('category_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.productcategories')),
            ],
        ),
    ]