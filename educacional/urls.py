from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TipoGradeViewSet, NivelEnsinoViewSet, SerieViewSet, TurnoViewSet, TurmaViewSet

router = DefaultRouter()
router.register(r'tipos-grades', TipoGradeViewSet)
router.register(r'niveis-ensinos', NivelEnsinoViewSet)
router.register(r'series', SerieViewSet)
router.register(r'turnos', TurnoViewSet)
router.register(r'turmas', TurmaViewSet)

urlpatterns = [
    path('', include(router.urls)),
]