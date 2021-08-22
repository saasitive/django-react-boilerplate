from django.db import models

class TEdits(models.Model):
    editid = models.AutoField(db_column='EditID', primary_key=True)  # Field name made lowercase.
    ts_edit = models.DateTimeField()
    siteid = models.IntegerField(db_column='siteID')  # Field name made lowercase.
    id = models.IntegerField()
    period_from = models.IntegerField()
    period_to = models.IntegerField()
    fieldid = models.IntegerField(db_column='fieldID')  # Field name made lowercase.
    ts_editstart = models.DateTimeField(db_column='ts_EditStart')  # Field name made lowercase.
    ts_editend = models.DateTimeField(db_column='ts_EditEnd')  # Field name made lowercase.
    username = models.CharField(max_length=200)
    comment = models.CharField(max_length=2000, blank=True, null=True)
    newval = models.IntegerField(db_column='newVal', blank=True, null=True)  # Field name made lowercase.
    newvalfloat = models.FloatField(db_column='newValFloat', blank=True, null=True)  # Field name made lowercase.
    note = models.CharField(max_length=2000, blank=True, null=True)
    groupid = models.IntegerField(db_column='groupID', blank=True, null=True)  # Field name made lowercase.
    newval2 = models.IntegerField(db_column='newVal2', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_Edits'
