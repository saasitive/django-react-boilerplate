from django.db import models


class TGroupmembers(models.Model):
    groupid = models.IntegerField(db_column='GroupID', primary_key=True)  # Field name made lowercase.
    id = models.IntegerField(db_column='ID')  # Field name made lowercase.
    siteid = models.IntegerField(blank=True, null=True)

    class Meta:
        db_table = 't_GroupMembers'
        unique_together = (('groupid', 'id'),)


class TGroups(models.Model):
    groupid = models.IntegerField(db_column='GroupID', primary_key=True)  # Field name made lowercase.
    siteid = models.IntegerField(db_column='SiteID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_groups'
