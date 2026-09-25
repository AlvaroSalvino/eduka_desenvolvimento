from django.contrib.auth import get_user_model
from rest_framework import viewsets
from core.permissions import ReadOnlyOrAdmin
from .models import Aluno, Matricula
from .serializers import AlunoSerializer, AlunoListSerializer, MatriculaSerializer

User = get_user_model()

class AlunoViewSet(viewsets.ModelViewSet):
    queryset = Aluno.objects.all()
    serializer_class = AlunoSerializer
    permission_classes = [ReadOnlyOrAdmin]


class MatriculaViewSet(viewsets.ModelViewSet):
    queryset = Matricula.objects.select_related(
        'aluno__pessoa',
        'turma__serie',
        'turma__turno'
    ).all()
    permission_classes = [ReadOnlyOrAdmin]
    def get_serializer_class(self):
        if self.action == 'list':
            return AlunoListSerializer
        return MatriculaSerializer