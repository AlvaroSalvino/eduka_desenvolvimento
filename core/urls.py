from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PessoaViewSet, PerfilViewSet, LoginView, MeView

router = DefaultRouter()
router.register(r'pessoas', PessoaViewSet)
router.register(r'perfis', PerfilViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', LoginView.as_view()),
    path('me/', MeView.as_view()),
]