from django.contrib import admin
from django.urls import path, include
from django.contrib.auth.views import LogoutView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('aluno/', include('aluno.urls')),
    path('core/', include('core.urls')),
    path('educacional/', include('educacional.urls')),
    path('financeiro/', include('financeiro.urls')),
    path('instituicao/', include('instituicao.urls')),
    path('', include('vitrine.urls')),
]
