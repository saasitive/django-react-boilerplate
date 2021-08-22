from django import forms
from wopr.utils import makeChoicesList_EditsQualityCheck, makeSiteList
from wopr.widgets import XDSoftDateTimePickerInput
from wopr.models import TSites, TSiteconfig


class SiteDateTimeForm(forms.Form):
    site_id = forms.CharField(widget=forms.Select(choices=[])) # this needs to be a list from the database... kinda like below birth year picker
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'})) #2012-03-10 14:30


    def __init__( self, *args, **kargs ):
        super().__init__( *args, **kargs )
        self.fields[ 'site_id' ].choices = makeChoicesList_EditsQualityCheck()

class SiteTimeRangeForm(forms.Form):
    #site_id = forms.CharField(widget=forms.Select(choices=CHOICES)) 
    site_id = forms.ModelChoiceField(queryset=TSites.objects.all()) 
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if start_time and end_time:
            if end_time <= start_time:
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time range is valid.")
                #self.add_error('start_time', "Please ensure the time range is valid.")
                #self.add_error('end_time', "Please ensure the time range is valid.")


class TimeRangeForm(forms.Form):
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if start_time and end_time:
            if end_time <= start_time:
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time range is valid.")


class SiteSelectionForm(forms.Form):
    site_id = forms.CharField(label='Site', widget=forms.Select(choices=[])) # this needs to be a list from the database... kinda like below birth year picker


    def __init__(self, *args, **kargs):
        super().__init__( *args, **kargs )
        self.fields[ 'site_id' ].choices = makeSiteList()

class SiteTurbineTimeForm(forms.Form):
    site_id = forms.CharField(widget=forms.Select(choices=[]))
    turbine_id = forms.CharField(widget=forms.Select(choices={}))
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if start_time and end_time:
            if end_time <= start_time:
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time range is valid.")
                #self.add_error('start_time', "Please ensure the time range is valid.")
                #self.add_error('end_time', "Please ensure the time range is valid.")
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['turbine_id'].queryset = TSiteconfig.objects.none().values("turbine")
        self.fields[ 'site_id' ].choices = makeSiteList()

        if 'site_id' in self.data:
            try:
                site = int(self.data.get('site_id')) #need site id too...
                self.fields['turbine_id'].queryset = TSiteconfig.objects.filter(siteid=site).values('turbine')
            except (ValueError, TypeError):
                pass  # invalid input from the client; ignore and fallback to empty turbine queryset
