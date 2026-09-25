from rest_framework.permissions import BasePermission, SAFE_METHODS
from .models import Perfil


class IsAdminPerfil(BasePermission):
    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        try:
            perfil = request.user.perfil
            return perfil.tipo == 'admin'
        except Perfil.DoesNotExist:
            return False


class IsOwnerOrAdmin(BasePermission):
    def has_object_permission(self, request, view, obj):
        if not request.user.is_authenticated:
            return False

        try:
            perfil = request.user.perfil
        except Perfil.DoesNotExist:
            return False

        # Admin pode tudo
        if perfil.tipo == 'admin':
            return True

        # Usuário comum só pode acessar o que criou
        return obj.criado_por == request.user


class ReadOnlyOrAdmin(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True

        try:
            perfil = request.user.perfil
            return perfil.tipo == 'admin'
        except:
            return False