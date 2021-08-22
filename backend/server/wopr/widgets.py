# from django.forms import DateTimeInput

# class BootstrapDateTimePickerInput(DateTimeInput):
#     template_name = 'wopr/widgets/bootstrap_datetimepicker.html'

#     def get_context(self, name, value, attrs):
#         datetimepicker_id = 'datetimepicker_{name}'.format(name=name)
#         if attrs is None:
#             attrs = dict()
#         attrs['data-target'] = '#{id}'.format(id=datetimepicker_id)
#         attrs['class'] = 'form-control datetimepicker-input'
#         context = super().get_context(name, value, attrs)
#         context['widget']['datetimepicker_id'] = datetimepicker_id
#         return context

from django.forms import DateTimeInput

class XDSoftDateTimePickerInput(DateTimeInput):
    template_name = 'wopr/widgets/xdsoft_datetimepicker.html'

