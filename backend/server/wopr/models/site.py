from django.db import models


class TSites(models.Model):
    siteid = models.IntegerField(db_column='SiteID', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=100)  # Field name made lowercase.
    doimportflow = models.IntegerField(db_column='doImportFlow')  # Field name made lowercase.
    dsnid = models.IntegerField(db_column='DSNID', blank=True, null=True)  # Field name made lowercase.
    strwstagname = models.CharField(db_column='strWSTagName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    strkwtagname = models.CharField(db_column='strkWTagName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    streventtagname = models.CharField(db_column='strEventTagName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    strdsn = models.CharField(db_column='strDSN', max_length=100, blank=True, null=True)  # Field name made lowercase.
    tz_offsetfromhistorian_h = models.IntegerField(db_column='tz_offsetFromHistorian_h')  # Field name made lowercase.
    eventmod1000 = models.SmallIntegerField(db_column='EventMod1000')  # Field name made lowercase.
    strstatustagname = models.CharField(db_column='strStatusTagName', max_length=100, blank=True, null=True)  # Field name made lowercase.
    nnsite1 = models.IntegerField(db_column='nnSite1', blank=True, null=True)  # Field name made lowercase.
    nnsite2 = models.IntegerField(db_column='nnSite2', blank=True, null=True)  # Field name made lowercase.
    albertasmp = models.SmallIntegerField(db_column='AlbertaSMP', blank=True, null=True)  # Field name made lowercase.
    greencreditstart = models.DateTimeField(db_column='GreenCreditStart', blank=True, null=True)  # Field name made lowercase.
    greencreditend = models.DateTimeField(db_column='GreenCreditEnd', blank=True, null=True)  # Field name made lowercase.
    greencredit_cd = models.FloatField(db_column='GreenCredit_cd', blank=True, null=True)  # Field name made lowercase.
    ppaescalation = models.CharField(db_column='PPAEscalation', max_length=200, blank=True, null=True)  # Field name made lowercase.
    greencreditstartperiod = models.BigIntegerField(db_column='GreenCreditStartPeriod', blank=True, null=True)  # Field name made lowercase.
    greencreditendperiod = models.BigIntegerField(db_column='GreenCreditEndPeriod', blank=True, null=True)  # Field name made lowercase.
    power_in_mw = models.SmallIntegerField(db_column='Power_in_MW', blank=True, null=True)  # Field name made lowercase.
    importtimeoffset_h = models.IntegerField(db_column='importTimeOffset_h', blank=True, null=True)  # Field name made lowercase.
    capacity_mw = models.FloatField(db_column='Capacity_MW', blank=True, null=True)  # Field name made lowercase.
    jvrate = models.FloatField(db_column='JVRate', blank=True, null=True)  # Field name made lowercase.
    financereportordering = models.IntegerField(db_column='FinanceReportOrdering', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_sites'

    def getSiteDescription(self):
        return self.description

    def __str__(self):
        return str(self.siteid) + " - " + self.description


class TSiteconfig(models.Model):
    siteid = models.ForeignKey('TSites', models.DO_NOTHING, db_column='siteID')  # Field name made lowercase.
    id = models.IntegerField(db_column='ID', primary_key=True)  # Field name made lowercase.
    turbine = models.CharField(db_column='Turbine', max_length=255)  # Field name made lowercase.
    kksname = models.CharField(db_column='KKSName', max_length=255)  # Field name made lowercase.
    turbtypeid = models.IntegerField(db_column='turbTypeID')  # Field name made lowercase.
    pad = models.IntegerField(db_column='Pad', blank=True, null=True)  # Field name made lowercase.
    gearboxfrom = models.DateTimeField(db_column='GearboxFrom', blank=True, null=True)  # Field name made lowercase.
    gearbox_make = models.CharField(db_column='Gearbox Make', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    gearbox_model = models.CharField(db_column='Gearbox Model', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    generatorfrom = models.DateTimeField(db_column='GeneratorFrom', blank=True, null=True)  # Field name made lowercase.
    generator_make = models.CharField(db_column='Generator Make', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    generator_model = models.CharField(db_column='Generator Model', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    nn1 = models.IntegerField(blank=True, null=True)
    nn2 = models.IntegerField(blank=True, null=True)
    includeinsitetotals = models.SmallIntegerField(db_column='IncludeInSiteTotals')  # Field name made lowercase.
    mw = models.DecimalField(db_column='MW', max_digits=18, decimal_places=3, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_SiteConfig'
        unique_together = (('siteid', 'id'),)
