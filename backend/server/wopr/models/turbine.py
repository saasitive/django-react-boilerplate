from django.db import models

class TTurbtypes(models.Model):
    turbtypeid = models.FloatField(db_column='TurbTypeID', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=255, blank=True, null=True)  # Field name made lowercase.
    mw = models.FloatField(db_column='MW', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_turbTypes'
