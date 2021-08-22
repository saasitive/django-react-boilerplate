from django.db import models

class TWoprnotes(models.Model):
    siteid = models.IntegerField(db_column='SiteID', primary_key=True)  # Field name made lowercase.
    id = models.IntegerField(db_column='ID')  # Field name made lowercase.
    periodid = models.BigIntegerField(db_column='periodID')  # Field name made lowercase.
    username = models.CharField(db_column='Username', max_length=50)  # Field name made lowercase.
    note = models.CharField(db_column='Note', max_length=4000)  # Field name made lowercase.
    ts_utc = models.DateTimeField(db_column='ts_UTC', blank=True, null=True)  # Field name made lowercase.
    notificationid = models.IntegerField(db_column='notificationID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_WOPRNotes'
        unique_together = (('siteid', 'id', 'periodid'),)
