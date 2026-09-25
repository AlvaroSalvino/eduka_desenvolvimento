from django.urls import path, re_path
from .views import *

urlpatterns = [
    # Fallback para React Router (SPA)
    re_path(r'^.*$', react_site),
]
