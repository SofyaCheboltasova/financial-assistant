# Generated by Django 4.2.7 on 2024-03-15 12:41

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('app', '0004_bankloansubsection'),
    ]

    operations = [
        migrations.CreateModel(
            name='BankLoanDetail',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=255)),
                ('subsection_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='app.bankloansubsection')),
            ],
        ),
    ]
