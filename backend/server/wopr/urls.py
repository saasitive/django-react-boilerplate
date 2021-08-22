from django.urls import path
from django.views.generic import TemplateView

from . import views

urlpatterns = [

    # Paths for 404, blank, and the index/dashboard
    path('', views.selectSite, name='index'),
    path('selectSite/', views.selectSite, name='selectSite'),
    path('dashboard/', views.dashboardSelectSite, name='dashboard'),
    path('blank/', TemplateView.as_view(template_name='wopr/blank.html'), name='blank'),
    path('instructions/', TemplateView.as_view(template_name='wopr/instructions.html'), name='instructions'),
    path('ieso/', views.iesoView, name='iesoUpload'),

    # Paths for edits, siteconfig, eventsData, and energyData
    path('editsTable/', TemplateView.as_view(template_name='wopr/editsTable.html'), name='edits-table'),

    path('siteconfig/', TemplateView.as_view(template_name='wopr/siteconfig.html'), name='site-config'),
    path('eventsData/', TemplateView.as_view(template_name='wopr/eventsData.html'), name='events-data'),
    path('energyData/', TemplateView.as_view(template_name='wopr/energyData.html'), name='energy-data'),

    path('timezone/', views.set_timezone, name='time-zone'),
    path('commitPage/', views.commitPage , name='commit-page'),

    # Paths for reports
    path('reports/editsReport/', views.getEditsReport , name='edits-report'),
    path('reports/powerCurveReport/', views.powerCurveView, name='powerCurve-report'),
    path('reports/powerCurveComparisonReport', views.powerCurveCompareView, name='powerCurve-report-compare'),
    path('reports/recurringFaultReport/', views.recurringFaultsView, name='recurFault-report'),
    path('reports/top20FaultsReport/', views.top20FaultsView, name='top20Fault-report'),
    path('reports/editsQualityCheckReport/', views.QualityCheckView, name='editsQuality-report'),
    path('reports/siteStartTimeEndTimeForm', views.QualityCheckView, name='site-start-end-form'),
    

    # Paths used by ajax calls
    path('filterEvent/', views.filterEvent, name='filter-event'),
    path('filterEnergy/', views.filterEnergy, name='filter-energy'),
    path('filterConfig/', views.filterConfig, name='filter-config'),
    path('filterEdits/', views.filterEdits, name='filter-edits'),
    path('filterTurbines/', views.filterTurbines, name='filter-turbines'),

    path('tsites/', views.getTSites, name='ajaxT_sites'),
    path('dashboard/<int:site>/', views.dashboard, name='dashboard-site'),
    path('editsTable/<int:site>', views.getEdits, name='ajax_edits'),
    path('siteconfig/<int:site>', views.getSiteConfig, name='ajaxT_siteconfig'),
    path('events/<int:site>', views.getEvents, name='ajaxT_eventdata'),
    path('energy/<int:site>', views.getEnergy, name='ajaxT_energydata'),
    path('postDashboardChanges/', views.postDashboardChanges, name='store-changes'),

    path('tenMinuteData/', views.ajaxTenMinuteData, name='ajax_TenMinuteData'),
    path('changesArray/', views.getChangesArray, name='ajax_changes_array'),
    path('commitChanges/', views.commitDashboardChanges, name='commit-changes'),
    path('discardChanges/', views.discardDashboardChanges, name='discard-changes'),
    path('storeSessionData/', views.storeSessionData, name='store-session-data'),
]
