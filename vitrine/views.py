from django.shortcuts import render
from instituicao.models import Ies

def react_site(request):
    ies = Ies.objects.first()
    context = {
        'ies': ies
    }
    return render(request, "react.html", context)