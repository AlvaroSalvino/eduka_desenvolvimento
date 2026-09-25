from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IesViewSet

router = DefaultRouter()
router.register(r'ies', IesViewSet)

urlpatterns = [
    path('', include(router.urls)),
]