from django.db import models

class TKksnames(models.Model):
    kks_name = models.CharField(db_column='KKS_Name', primary_key=True, max_length=50)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_KKSNames'
