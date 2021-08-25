from django.db import models


class TPowercurves(models.Model):
    powercurveid = models.AutoField( primary_key = True )
    siteid = models.IntegerField(db_column='siteID')  # Field name made lowercase.
    id = models.IntegerField()
    nws_bin = models.DecimalField(max_digits=5, decimal_places=1)
    kw = models.FloatField(db_column='kW', blank=True, null=True)  # Field name made lowercase.
    kw_min = models.FloatField(blank=True, null=True)
    kw_max = models.FloatField(blank=True, null=True)
    kw_std = models.FloatField(blank=True, null=True)

    class Meta:
        db_table = 't_powerCurves'
        unique_together = (('id', 'nws_bin'))
