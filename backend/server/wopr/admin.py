from django.contrib import admin
from .models import TEnergydata, TEventdata, TSiteconfig, TSites, TEdits

# Register your models here.
admin.site.register([ TEnergydata, TEventdata, TSiteconfig, TSites, TEdits ])