from django import forms
from wopr.widgets import XDSoftDateTimePickerInput
from django.core.validators import FileExtensionValidator


class UsernameForm(forms.Form):
    CHOICES = [('knoske','knoske'), ('dseely','dseely'), ('llessard','llessard')]
    usernames = forms.CharField(label='User ', widget=forms.Select(choices=CHOICES))
    site_selected = forms.CharField(widget=forms.HiddenInput())

class EditsTableForm(forms.Form):
    start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %H:%M'], widget=XDSoftDateTimePickerInput(attrs={'autocomplete':'off'}))
    CHOICES = [('knoske','knoske'), ('dseely','dseely'), ('llessard','llessard')]
    usernames = forms.CharField(label='User ', widget=forms.Select(choices=CHOICES))
    site_selected = forms.CharField(widget=forms.HiddenInput())
    def clean(self):
        cleaned_data = super().clean()
        start_time = cleaned_data.get("start_time")
        end_time = cleaned_data.get("end_time")
        if start_time and end_time:
            if end_time <= start_time:
                print(str(end_time)+"<="+str(start_time)+" returned "+str(end_time <= start_time))
                raise forms.ValidationError(" - ERROR - Please ensure the time range is valid.")


class UploadIESOFileForm(forms.Form):
    IESO_file = forms.FileField(validators=[FileExtensionValidator(allowed_extensions=['xlsx'])])
    useMidnight = forms.BooleanField(initial=True, required=False)


# class DateForm(forms.Form):
#     date = forms.DateTimeField(
#         input_formats=['%d/%m/%Y %H:%M'], 
#         widget=XDSoftDateTimePickerInput()
#     )

# class CommentForm(forms.Form):
#     name = forms.CharField()
#     url = forms.URLField()
#     comment = forms.CharField(widget=forms.Textarea)

# class oldSiteDateTimeForm(forms.Form):
#     site_id = forms.CharField()
#     start_time = forms.CharField(widget=forms.DateTimeInput())
#     end_time = forms.DateTimeField(widget=forms.DateTimeInput())

# class bsSiteDateTimeForm(forms.Form):
#     site_id = forms.CharField() # this needs to be a list from the database... kinda like below birth year picker
#     start_time = forms.DateTimeField(input_formats=['%d/%m/%Y %h:%M %A'], widget=BootstrapDateTimePickerInput())
#     end_time = forms.DateTimeField(input_formats=['%d/%m/%Y %h:%M %A'], widget=BootstrapDateTimePickerInput()) #2012-03-10 14:30

# class siteID_startTime_endTime(forms.Form):
#     siteID = forms.NumberInput()
#     startTime = forms.DateTimeInput()
#     endTime = forms.DateTimeInput()

# BIRTH_YEAR_CHOICES = ('1980', '1981', '1982')
# FAVORITE_COLORS_CHOICES = (
#     ('blue', 'Blue'),
#     ('green', 'Green'),
#     ('black', 'Black'),
# )



# class SimpleForm(forms.Form):
#     birth_year = forms.DateField(widget=forms.SelectDateWidget(years=BIRTH_YEAR_CHOICES))
#     favorite_colors = forms.MultipleChoiceField(
#         required=False,
#         widget=forms.CheckboxSelectMultiple,
#         choices=FAVORITE_COLORS_CHOICES,
#     )