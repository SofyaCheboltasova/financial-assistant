# Generated by Django 4.2.7 on 2024-03-09 09:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0002_productcategories'),
    ]

    operations = [
        migrations.RenameField(
            model_name='productcategories',
            old_name='bank',
            new_name='bank_id',
        ),
        migrations.RenameField(
            model_name='productcategories',
            old_name='product',
            new_name='product_id',
        ),
    ]