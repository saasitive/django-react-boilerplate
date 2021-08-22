from django import forms
from wopr.widgets import XDSoftDateTimePickerInput
from wopr.utils import makeTurbineList


class FilterDashboardForm(forms.Form):
    # Default values
    CHOICES = ['Turbine' + str(i + 1) for i in range(1, 100)]
    start_time = forms.DateTimeField(label='From Time', input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(label='Till Time', input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    id_from = forms.ChoiceField(label='From Turbine', choices=CHOICES)
    id_till = forms.ChoiceField(label='Till Turbine', choices=CHOICES)

    # Constructor with parameters
    def __init__(self, *args,**kwargs):
        self.siteid = kwargs.pop('siteid')
        self.id_from = kwargs.pop('id_from')
        self.id_till = kwargs.pop('id_till')
        self.CHOICES = makeTurbineList(self.siteid, self.id_from, self.id_till)
        self.lastIndex = self.CHOICES[len(self.CHOICES) - 1]
        super(FilterDashboardForm, self).__init__(*args, **kwargs)
        self.fields['id_from'] = forms.ChoiceField(label='From Turbine', choices=self.CHOICES)
        self.fields['id_till'] = forms.ChoiceField(label='Till Turbine', choices=self.CHOICES, initial=self.lastIndex)

    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if start_time and end_time:
            if end_time <= start_time:
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time range is valid.")
