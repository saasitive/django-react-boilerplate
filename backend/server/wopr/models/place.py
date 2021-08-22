from django.db import models

class TProvinces(models.Model):
    provinceid = models.IntegerField(db_column='ProvinceID', blank=True, null=True)  # Field name made lowercase.
    province = models.CharField(db_column='Province', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_Provinces'


class TRegions(models.Model):
    regioncode = models.IntegerField(db_column='RegionCode', blank=True, null=True)  # Field name made lowercase.
    regionname = models.CharField(db_column='RegionName', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_Regions'
