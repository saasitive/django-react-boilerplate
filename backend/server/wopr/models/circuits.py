from django.db import models

class TCircuits(models.Model):
    circuitid = models.IntegerField(db_column='CircuitID', primary_key=True)  # Field name made lowercase.
    id = models.IntegerField(db_column='ID')  # Field name made lowercase.
    siteid = models.IntegerField(db_column='siteID', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        db_table = 't_Circuits'
        unique_together = (('circuitid', 'id'),)
