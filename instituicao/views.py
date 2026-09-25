from rest_framework import viewsets
from .models import Ies
from .serializers import IesSerializer
from core.permissions import ReadOnlyOrAdmin

class IesViewSet(viewsets.ModelViewSet):
    queryset = Ies.objects.all()
    serializer_class = IesSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Ies.objects.none()

        try:
            perfil = user.perfil
        except:
            return Ies.objects.none()

        if perfil.tipo == 'admin':
            return Ies.objects.all().select_related(
                'criado_por', 'atualizado_por'
            )

        return Ies.objects.filter(
            criado_por=user
        ).select_related('criado_por', 'atualizado_por')