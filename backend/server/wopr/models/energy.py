from django.db import models

class TEnergydata(models.Model):
    siteid = models.ForeignKey('TSites', models.DO_NOTHING, db_column='siteID')  # Field name made lowercase.
    id = models.ForeignKey('TSiteconfig', models.DO_NOTHING, db_column='id')
    ts = models.DateTimeField()
    periodid = models.BigIntegerField(db_column='periodID', primary_key=True, db_index=True)  # Field name made lowercase.
    nws = models.FloatField(blank=True, null=True)
    kw_net = models.FloatField(blank=True, null=True)
    kw_exp = models.FloatField(blank=True, null=True)
    validfrom = models.DateTimeField(db_column='validFrom')  # Field name made lowercase.
    validto = models.DateTimeField(db_column='validTo')  # Field name made lowercase.
    kw_min_exp = models.FloatField(db_column='kW_min_exp', blank=True, null=True)  # Field name made lowercase.
    curtailed = models.SmallIntegerField()
    edited = models.SmallIntegerField(blank=True, null=True)

    class Meta:
        db_table = 't_EnergyData'
        unique_together = (('siteid', 'id', 'periodid'),)

    def __str__(self):
        return str(self.siteid) + ' ' +  str(self.id) + ', ' + str(self.periodid)
