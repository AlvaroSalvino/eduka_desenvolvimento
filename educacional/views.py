from rest_framework import viewsets
from .models import TipoGrade, NivelEnsino, Serie, Turno, Turma
from .serializers import TipoGradeSerializer, NivelEnsinoSerializer, SerieSerializer, TurnoSerializer, TurmaSerializer
from core.permissions import ReadOnlyOrAdmin
from django.db.models import Count, Q


class TipoGradeViewSet(viewsets.ModelViewSet):
    queryset = TipoGrade.objects.select_related(
        'criado_por', 'atualizado_por'
    )
    serializer_class = TipoGradeSerializer
    permission_classes = [ReadOnlyOrAdmin]


class NivelEnsinoViewSet(viewsets.ModelViewSet):
    queryset = NivelEnsino.objects.select_related('tipo_grade', 'criado_por', 'atualizado_por')
    serializer_class = NivelEnsinoSerializer
    permission_classes = [ReadOnlyOrAdmin]

    
class SerieViewSet(viewsets.ModelViewSet):
    queryset = Serie.objects.select_related('nivel', 'criado_por', 'atualizado_por')
    serializer_class = SerieSerializer
    permission_classes = [ReadOnlyOrAdmin]

    
class TurnoViewSet(viewsets.ModelViewSet):
    queryset = Turno.objects.select_related(
        'criado_por', 'atualizado_por'
    )
    serializer_class = TurnoSerializer
    permission_classes = [ReadOnlyOrAdmin]

    
class TurmaViewSet(viewsets.ModelViewSet):
    queryset = Turma.objects.select_related(
        'serie',
        'serie__nivel',
        'serie__nivel__tipo_grade',
        'turno',
        'criado_por',
        'atualizado_por'
    ).annotate(
        alunos_ativos=Count(
            'matriculas',
            filter=Q(matriculas__status='ativo')
        )
    ).order_by('ano_letivo', 'periodo_letivo')
    serializer_class = TurmaSerializer
    permission_classes = [ReadOnlyOrAdmin]