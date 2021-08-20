from django.shortcuts import render


def index( request ):
    return render( request, 'core/index.html', { 'msg': 'You have reached the django apis.' } )
