from django.db import models


class TStates(models.Model):
    stateid = models.IntegerField(db_column='StateID', primary_key=True)  # Field name made lowercase.
    state = models.CharField(db_column='State', max_length=255, blank=True, null=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=255, blank=True, null=True)  # Field name made lowercase.
    hydrocode = models.IntegerField(db_column='hydroCode', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_States'


class TSystems(models.Model):
    systemid = models.IntegerField(db_column='SystemID', primary_key=True)  # Field name made lowercase.
    system = models.CharField(db_column='System', max_length=255, blank=True, null=True)  # Field name made lowercase.
    description = models.CharField(db_column='Description', max_length=255, blank=True, null=True)  # Field name made lowercase.
    defined_state = models.CharField(db_column='Defined State', max_length=255, blank=True, null=True)  # Field name made lowercase. Field renamed to remove unsuitable characters.
    examples = models.CharField(db_column='Examples', max_length=255, blank=True, null=True)  # Field name made lowercase.
    definedstateid = models.IntegerField(db_column='DefinedStateID', blank=True, null=True)  # Field name made lowercase.
    hydrocode = models.IntegerField(db_column='hydroCode', blank=True, null=True)  # Field name made lowercase.
    systemcategory = models.CharField(db_column='SystemCategory', max_length=255, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_Systems'
