from django.db import migrations, connection
import os


def createDB( apps, schemaEditor ):
    print( 'creating db' )

    file_path = os.path.join(os.path.dirname(__file__), 'data.sql')
    sql_statement = open(file_path).read()
    
    cursor = connection.cursor()
    cursor.execute(sql_statement)


def deleteDB( apps, schemaEditor ):
    TEventdata = apps.get_model( 'wopr', 'TEventdata' )
    TSystems = apps.get_model( 'wopr', 'TSystems' )
    TStates = apps.get_model( 'wopr', 'TStates' )
    TPowercurves = apps.get_model( 'wopr', 'TPowercurves' )
    TEdits = apps.get_model( 'wopr', 'TEdits' )
    TEnergydata = apps.get_model( 'wopr', 'TEnergydata' )
    TSites = apps.get_model( 'wopr', 'TSites' )
    TSiteConfig = apps.get_model( 'wopr', 'TSiteConfig' )
    print( 'deleting db' )
    TEventdata.objects.all().delete()
    TSystems.objects.all().delete()
    TStates.objects.all().delete()
    TPowercurves.objects.all().delete()
    TEnergydata.objects.all().delete()
    TEdits.objects.all().delete()
    TSiteConfig.objects.all().delete()
    TSites.objects.all().delete()


class Migration( migrations.Migration ):


    dependencies = [
        ( 'wopr', '0001_initial_models' ),
    ]

    operations = [
        migrations.RunPython( code = createDB, reverse_code = deleteDB ),
    ]
