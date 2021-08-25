# Define the utility or helper functions for edits here so that the views page is not populated

import json
from datetime import timedelta, datetime, date
import pytz
from django.db import connection
from .models import *

def isNum(data):
    try:
        int(data)
        return True
    except ValueError:
        return False

# Function that json.dumps() uses which converts datetime object to JSON string with format "2012-03-09 01:50:00" (gets rid of T)
def dateConverter(o):
    if isinstance(o, datetime):
        return o.__str__()
    return o

# code that makes a dict from a raw sql query
def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [col[0] for col in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

# used for quality report to make the dictionary into the format:
# {editID:{ts_edit,description,Turbine,period_from,period_to,ts_editstart,ts_editend,username,comment}}
def idPairDict(d):
        retdict = {}
        for each in d:
                subdict = {'ts_edit':each['ts_edit'],'description':each['description'],'turbine':each['Turbine'],'period_from':each['period_from'],'period_to':each['period_to'],'ts_editstart':['ts_EditStart'],'ts_editend':each['ts_EditEnd'],'username':each['username'],'comment':['comment']}
                retdict[each['editID']] = subdict
        return retdict
    
# Return an array that contains the colors for each state
def getStateColors():
        return [
        {
            'state': 'CTH',
            'description': 'Contact Turbine-Hours',
            'code': 0,
            'color': '#FFFFFF'

        },
        {
            'state': 'RSTH',
            'description': 'Reserve Shutdown Turbine-Hours',
            'code': 1,
            'color': '#cedcff'
        },
        {
            'state': 'FTH',
            'description': 'Forced Turbine-Hours',
            'code': 2,
            'color': '#ffa500'
        },
        {
            'state': 'MTH',
            'description': 'Maintenance Turbine-Hours',
            'code': 3,
            'color': '#ffff00'
        },
        {
            'state': 'PTH',
            'description': 'Planned Turbine-Hours',
            'code': 4,
            'color': '#3eb503'
        },
        {
            'state': 'oFTH',
            'description': 'Out of Management Control Forced Turbine-Hours',
            'code': 5,
            'color': '#089ad9'
        },
        {
            'state': 'oMTH',
            'description': 'Out of Management Control Maintenance Turbine-Hours',
            'code': 6,
            'color': '#05668f'
        },
        {
            'state': 'oPTH',
            'description': 'Out of Management Control Planned Turbine-Hours',
            'code': 7,
            'color': '#808080'
        },
        {
            'state': 'RUTH',
            'description': 'Resource Unavailable Turbine-Hours',
            'code': 8,
            'color': '#FFFFFF'
        },
        {
            'state': 'IRTH',
            'description': 'Inactive Reserve Turbine-Hours',
            'code': 9,
            'color': '#800080'
        },
        {
            'state': 'MBTH',
            'description': 'Mothballed Turbine-Hours',
            'code': 10,
            'color': '#800000'
        },
        {
            'state': 'RTH',
            'description': 'Retired Unit Turbine-Hours',
            'code': 11,
            'color': '#008080'
        },
        {
            'state': 'DTH',
            'description': 'Derated Turbine-Hours',
            'code': 12,
            'color': '#45f29f'
        },
        {
            'state': 'oDTH',
            'description': 'Out of Management Control Derated Turbine-Hours',
            'code': 13,
            'color': '#FF69B4'
        },
        {
            'state': 'FDXTH - Env',
            'description': 'Forced Delay Turbine Hours - Environment',
            'code': 14,
            'color': '#f59d67'
        },
         # Skips code no. 15 here for some reason accoding to WOPRLegend
        {
            'state': 'FDXTH - Eq',
            'description': 'Forced Delay Turbine Hours - Equipment',
            'code': 16,
            'color': '#f59d67'
        },
        {
            'state': 'FDXTH - Lab',
            'description': 'Forced Delay Turbine Hours - Labour',
            'code': 17,
            'color': '#f59d67'
        },
        {
            'state': 'FDXTH - Mat',
            'description': 'Forced Delay Turbine Hours - Material',
            'code': 18,
            'color': '#f59d67'
        },
        {
            'state': 'MDXTH - Env',
            'description': 'Maintenance Delay Turbine Hours - Environment',
            'code': 19,
            'color': '#f7d023'
        },
        # Skips code no# 20 here according to WOPRLegend
        {
            'state': 'MDXTH - Eq',
            'description': 'Maintenance Delay Turbine Hours - Equipment',
            'code': 21,
            'color': '#f7d023'
        },
        {
            'state': 'MDXTH - Lab',
            'description': 'Maintenance Delay Turbine Hours - Labour',
            'code': 22,
            'color': '#f7d023'
        },
        {
            'state': 'MDXTH - Mat',
            'description': 'Maintenance Delay Turbine Hours - Material',
            'code': 23,
            'color': '#f7d023'
        },
        {
            'state': 'PDXTH - Env',
            'description': 'Planned Delay Turbine Hours - Environment',
            'code': 24,
            'color': '#808000'
        },
        # Skips code# 25 here according to WOPRLegend
        {
            'state': 'PDXTH - Eq',
            'description': 'Maintenance Delay Turbine Hours - Equipment',
            'code': 26,
            'color': '#808000'
        },
        {
            'state': 'PDXTH - Lab',
            'description': 'Maintenance Delay Turbine Hours - Labour',
            'code': 27,
            'color': '#808000'
        },
        {
            'state': 'PDXTH - Mat',
            'description': 'Contact Turbine-Hours',
            'code': 28,
            'color': '#808000'
        },
        {
            'state': 'No Data',
            'description': 'No Data available from SCADA',
            'code': '',
            'color': '#FFFFFF'
        }

    ]

# Return an array that contains the colors for each system
def getSystemColors():
    return [
        {
            'system': 'BOP',
            'color': '#f47742'
        },
        {
            'system': 'Brake',
            'color': '#f4b241'
        },
        {
            'system': 'CS',
            'color': '#f1f441'
        },
        {
            'system': 'DT',
            'color': '#92d330'
        },
        {
            'system': 'Elec',
            'color': '#3ba5e2'
        },
        {
            'system': 'Ext',
            'color': '#a8b6bf'
        },
        {
            'system': 'GB',
            'color': '#a8b6bf'
        },
        {
            'system': 'Gen',
            'color': '#d1c0d8'
        },
        {
            'system': 'Hyd',
            'color': '#53196b'
        },
        {
            'system': 'Pitch',
            'color': '#db9d76'
        },
        {
            'system': 'Rotor',
            'color': '#7bb5c4'
        },
        {
            'system': 'Struct',
            'color': '#97e5bd'
        },
        {
            'system': 'Yaw',
            'color': '#d17fcd'
        },
        {
            'system': 'Wind Turbine',
            'color': '#b5a97c'
        },
        {
            'system': 'CTH',
            'color': '#FFFFFF'
        },
        {
            'system': 'PM',
            'color': '#f1f441'
        },
        {
            'system': 'Underperformance',
            'color': '#FFFFFF',
            'border': '#f73333'
        },
        {
            'system': 'No Production',
            'color': '#FFFFFF',
            'border': '#4d4bea'
        },
        {
            'system': 'Ext - Ice (OMC)',
            'color': '#7abbcc'
        },
        {
            'system': 'None',
            'color': '#FFFFFF'
        },
    ]

def makeChoicesList_EditsQualityCheck():
    # could have got this with the orm
    siteNames = TSites.objects.distinct().values_list( 'siteid', 'description' )

    siteList = []     
    for siteid, description in siteNames:
        tup = ('siteid', 'description')
        siteList.append(tup)
    
    return siteList

def makeSiteList():
    # could have got this with the orm
    siteNames = TSites.objects.distinct().values_list( 'siteid', 'description' )

    siteList = [ ( ' ', ' ' ) ]
    print( siteNames )
    for siteid, description in siteNames:
        tup = (siteid, description + ', ' + str(siteid))
        siteList.append(tup)
    
    return siteList

def makeTurbineList(site, id_from=0, id_till=500):
    query_set = TSiteconfig.objects.filter(siteid=site, id__range=[id_from, id_till]).order_by('id').values('id', 'kksname')
    if(len(query_set) > 0):
        return [(q['id'], 'Turbine ' + str(q['id']) + ', ' + q['kksname']) for q in query_set]
    else: # return 
        return [(-1,'There are no turbines available for this site.')]

# datetime objects returned as list.
# Note: inputs must be date objects.
def getDateDeltaList(dateStart, dateEnd):
    delta = dateEnd - dateStart
    #print('getDateDeltaList #days:',delta.days)

    dateObjectDeltaList = []
    for i in range(delta.days +1):
        dateObjectDeltaList.append(dateStart + timedelta(i))

    return dateObjectDeltaList

# gets the occurrence data for the table in quality checks report
def getOccurrenceTableData(site_id, start_time, end_time):
    # first get the date list. first convert datetimes to date.
    dateObjectList = getDateDeltaList(start_time.date(), end_time.date())
    #print('getOccurrenceTableData dateObjectList:',dateObjectList)

    data = []
    # then use those dates to get data from the database to sum up the values.
    for day in dateObjectList:
        numberOfCthEdits_column = occurrenceTable_getEditedCTH_columnValue(site_id, day)
        noData_column = occurrenceTable_getNoData_columnValue(site_id, day)
        stateChangesMidEvent = occurrenceTable_getStateChangesMidEvent(site_id, day)
        systemChangesMidEvent = occurrenceTable_getSystemChangesMidEvent(site_id, day)

        #Note: site red and blue boxes and site boxes will just be 'not input' for now till i know what they are and how to calculate them.
        BlueRedBoxesNotMarked = 'not input'
        SiteBoxesNotMarked = 'not input'

        listToAppend = [day, numberOfCthEdits_column, noData_column, stateChangesMidEvent, systemChangesMidEvent, BlueRedBoxesNotMarked, SiteBoxesNotMarked] 
        data.append(listToAppend)
    #print("PRINTING THIS DATA", data)
    return data

# this method checks if a state change was made while the event did not change.
# A potential problem with this method is if an event starts at ~24:50 on the previous day and state changes at ~00:00 the next day, it may not be detected.
def occurrenceTable_getStateChangesMidEvent(site_id, day):
    start_date = day
    end_date = day + timedelta(days=1)
    sum = 0

    # get the events, stateid, from the t_eventdata table
    events = TEventdata.objects.values('eventid','stateid').filter(siteid__exact=str(site_id)).filter(ts_start__range=(start_date,end_date)).order_by('ts_start')
    
    
    if not events:
        return sum # if nothing in the querryset just return 0.
    else:
        # if the STATE changes during an event sum it
        currentEventID = events.values('eventid')[0]['eventid']
        currentStateID = events.values('stateid')[0]['stateid']
        #print(day,'FIRSTEVENTID',currentEventID, 'FIRSTSTATEID',currentStateID)
        for row in events:
            eventID = row['eventid']
            stateID = row['stateid']

            if eventID != currentEventID:
                currentEventID = eventID
                currentStateID = stateID
            elif stateID != currentStateID:
                sum = sum +1
                currentStateID = stateID
    return sum


# this method checks if a system change was made while the event did not change.
# A potential problem with this method is if an event starts at ~24:50 on the previous day and system changes at ~00:00 the next day, it may not be detected.
def occurrenceTable_getSystemChangesMidEvent(site_id, day):
    start_date = day
    end_date = day + timedelta(days=1)
    sum = 0

    # get the events, systemid, from the t_eventdata table
    events = TEventdata.objects.values('eventid','systemid').filter(siteid__exact=str(site_id)).filter(ts_start__range=(start_date,end_date)).order_by('ts_start')

    if not events:
        return sum # if nothing in the querryset just return 0.
    else:
        # if the STATE changes during an event sum it
        currentEventID = events.values('eventid')[0]['eventid']
        currentSystemID = events.values('systemid')[0]['systemid']
        #print(day,'FIRSTEVENTID',currentEventID, 'FIRSTSYSTEMID',currentSystemID)
        for row in events:
            eventID = row['eventid']
            systemID = row['systemid']

            if eventID != currentEventID:
                currentEventID = eventID
                currentSystemID = systemID
            elif systemID != currentSystemID:
                sum = sum +1
                currentSystemID = systemID
    return sum


# this gets the integer value of the number of times that the system was set to CTH by an edit form the t_edits table
def occurrenceTable_getEditedCTH_columnValue(site_id, day):
    start_date = day
    #print(site_id,day,'START_DATE',start_date)
    end_date = day + timedelta(days=1)
    #end_date = dayEnd(day)
    #print(site_id,day,'END_DATE',end_date)

    # ORM stuff
    events = TEdits.objects.values('comment', 'newval').filter(siteid__exact=str(site_id)).filter(ts_edit__range=(start_date,end_date)).order_by('editid')
    #print(site_id,day,events.values('comment', 'newval'))
    
    # get the sum of the system changes to CTH from this day.
    sum = 0
    for row in events:
        #if the newval == 0 and the comment is: "Set System = CTH", then sum it up
        #print("THIS IS ROW NEWVAL:",row['newval'])
        if row['newval'] == 0:
            if checkSystemIsCth(row) == True:
                sum = sum +1

    return sum

# this function os for the occurrences table in the edits quality check report.
# this function checks if the system comment is set to CTH: "Set System = CTH"
def checkSystemIsCth(rowFromEvents):
    ret = False
    commentString = rowFromEvents['comment']
    sp = commentString.split('=')
    if 'Set System' in sp[0] and 'CTH' in sp[1]:
        #print("FOUND A SYSTEM SET")
        ret = True
    return ret

# this is a stub function for this for now. Need to find out what its meaning is.
# might be if state code and or system code is null...
def occurrenceTable_getNoData_columnValue(site_id, day):
    return 0

def dayStart(day):
    return day.replace(hour=0, minute=0, second=0)

def dayEnd(day):
    return day.replace(hour=23, minute=59, second=59)
