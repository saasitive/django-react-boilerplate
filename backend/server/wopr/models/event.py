from django.db import models


class TEventcodes(models.Model):
    eventid = models.IntegerField(db_column='EventID', primary_key=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=500, blank=True, null=True)  # Field name made lowercase.
    defaultstateid = models.IntegerField(db_column='DefaultStateID')  # Field name made lowercase.
    defaultsystemid = models.IntegerField(db_column='DefaultSystemID')  # Field name made lowercase.
    turbtypeid = models.IntegerField(db_column='TurbTypeID')  # Field name made lowercase.
    actionid = models.IntegerField(db_column='ActionID')  # Field name made lowercase.
    eventlevel = models.IntegerField(db_column='EventLevel')  # Field name made lowercase.

    class Meta:
        db_table = 't_EventCodes'
        unique_together = (('eventid', 'turbtypeid'),)


class TEventdata(models.Model):
    siteid = models.ForeignKey('TSites', models.DO_NOTHING, db_column='SiteID')   # Field name made lowercase.
    id = models.ForeignKey('TSiteconfig', models.DO_NOTHING, db_column='ID')  # Field name made lowercase.
    ts_start = models.DateTimeField()
    eventid = models.IntegerField(db_column='EventID')  # Field name made lowercase.
    param1 = models.FloatField(blank=True, null=True)
    param2 = models.FloatField(blank=True, null=True)
    stateid = models.IntegerField(db_column='StateID', blank=True, null=True)  # Field name made lowercase.
    systemid = models.IntegerField(db_column='SystemID', blank=True, null=True)  # Field name made lowercase.
    ts_end = models.DateTimeField()
    periodid = models.BigIntegerField(db_column='periodID', primary_key=True)  # Field name made lowercase.
    eventkey = models.BigIntegerField(db_column='EventKey')  # Field name made lowercase.
    statekey = models.BigIntegerField(db_column='StateKey', blank=True, null=True)  # Field name made lowercase.
    systemkey = models.BigIntegerField(db_column='SystemKey', blank=True, null=True)  # Field name made lowercase.
    validfrom = models.DateTimeField(db_column='ValidFrom')  # Field name made lowercase.
    validto = models.DateTimeField(db_column='ValidTo')  # Field name made lowercase.
    duration_ms = models.IntegerField()

    class Meta:
        db_table = 't_EventData'


class TEventdataEdited(models.Model):
    siteid = models.IntegerField(db_column='SiteID', primary_key=True)  # Field name made lowercase.
    id = models.IntegerField(db_column='ID')  # Field name made lowercase.
    ts_start = models.DateTimeField()
    eventid = models.IntegerField(db_column='EventID')  # Field name made lowercase.
    param1 = models.FloatField(blank=True, null=True)
    param2 = models.FloatField(blank=True, null=True)
    stateid = models.IntegerField(db_column='StateID', blank=True, null=True)  # Field name made lowercase.
    systemid = models.IntegerField(db_column='SystemID', blank=True, null=True)  # Field name made lowercase.
    ts_end = models.DateTimeField()
    periodid = models.BigIntegerField(db_column='periodID')  # Field name made lowercase.
    eventkey = models.BigIntegerField(db_column='EventKey')  # Field name made lowercase.
    statekey = models.BigIntegerField(db_column='StateKey', blank=True, null=True)  # Field name made lowercase.
    systemkey = models.BigIntegerField(db_column='SystemKey', blank=True, null=True)  # Field name made lowercase.
    validfrom = models.DateTimeField(db_column='ValidFrom')  # Field name made lowercase.
    validto = models.DateTimeField(db_column='ValidTo')  # Field name made lowercase.
    duration_ms = models.IntegerField()

    class Meta:
        db_table = 't_EventData_edited'
        unique_together = (('siteid', 'id', 'periodid'),)
