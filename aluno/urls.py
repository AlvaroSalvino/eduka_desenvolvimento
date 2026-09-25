from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import AlunoViewSet, MatriculaViewSet

router = DefaultRouter()
router.register(r'alunos', AlunoViewSet)
router.register(r'matriculas', MatriculaViewSet)


urlpatterns = [
    path('', include(router.urls)),
]