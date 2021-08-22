from django import forms
from wopr.utils import makeTurbineList, makeSiteList
from wopr.models import TSiteconfig
from wopr.widgets import XDSoftDateTimePickerInput


class TurbineSelectionForm(forms.Form):
    # Default values
    CHOICES = list(range(1, 100))
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    view_turbines_from = forms.ChoiceField(choices=CHOICES)
    view_turbines_till = forms.ChoiceField(choices=CHOICES)

    # Constructor with parameters
    def __init__(self, *args,**kwargs):
        self.siteid = kwargs.pop('siteid')
        self.CHOICES = makeTurbineList(self.siteid)
        super(TurbineSelectionForm, self).__init__(*args, **kwargs)
        self.fields['view_turbines_from'] = forms.ChoiceField(choices=self.CHOICES)
        self.fields['view_turbines_till'] = forms.ChoiceField(choices=self.CHOICES, initial=str(len(self.CHOICES)))


class CompareTurbinePowerForm(forms.Form):
    site_id_1 = forms.CharField(widget=forms.Select(choices=[]))
    turbine_id_1 = forms.CharField(widget=forms.Select(choices={}))
    start_time_1 = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time_1 = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))

    site_id_2 = forms.CharField(widget=forms.Select(choices=[]))
    turbine_id_2 = forms.CharField(widget=forms.Select(choices={}))
    start_time_2 = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time_2 = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    def clean(self):
        cleaned_data = super().clean()
        start_time_1 = cleaned_data.get("start_time_1")
        end_time_1 = cleaned_data.get("end_time_1")
        start_time_2 = cleaned_data.get("start_time_2")
        end_time_2 = cleaned_data.get("end_time_2")
        if start_time_1 and end_time_1 and start_time_2 and end_time_2:
            if (end_time_1 <= start_time_1) or (end_time_2 <= start_time_2):
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time ranges are valid.")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['turbine_id_1'].queryset = TSiteconfig.objects.none().values("turbine")

        self.fields[ 'site_id_1' ].choices = makeSiteList()
        self.fields[ 'site_id_2' ].choices = makeSiteList()


        if 'site_id_1' in self.data:
            try:
                site = int(self.data.get('site_id_1')) #need site id too...
                self.fields['turbine_id_1'].queryset = TSiteconfig.objects.filter(siteid=site).values('turbine')
            except (ValueError, TypeError):
                pass  # invalid input from the client; ignore and fallback to empty turbine queryset
        if 'site_id_2' in self.data:
            try:
                site = int(self.data.get('site_id_2')) #need site id too...
                self.fields['turbine_id_2'].queryset = TSiteconfig.objects.filter(siteid=site).values('turbine')
            except (ValueError, TypeError):
                pass  # invalid input from the client; ignore and fallback to empty turbine queryset
