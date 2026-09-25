from django.db import models
from django.contrib.auth import get_user_model
from educacional.models import NivelEnsino, Serie
from django.core.exceptions import ValidationError
from core.models import Pessoa

User = get_user_model()

class Aluno(models.Model):

    pessoa = models.OneToOneField(Pessoa, on_delete=models.CASCADE, related_name='aluno')

    observacoes = models.TextField(blank=True, null=True)

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alunos_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='alunos_atualizados'
    )

    class Meta:
        verbose_name = "Aluno"
        verbose_name_plural = "Alunos"
        ordering = ['-data_criacao', '-id']
        indexes = [
            models.Index(fields=['-data_criacao']),
        ]

    def __str__(self):
        return self.pessoa.nome_completo


class Matricula(models.Model):
    STATUS_CHOICES = [
        ('ativo', 'Ativo'),
        ('inativo', 'Inativo'),
        ('transferido', 'Transferido'),
        ('formado', 'Formado'),
        ('trancado', 'Trancado'),
    ]

    aluno = models.ForeignKey(
        Aluno,
        on_delete=models.CASCADE,
        related_name="matriculas"
    )

    turma = models.ForeignKey(
        'educacional.Turma',
        on_delete=models.PROTECT,
        related_name="matriculas"
    )

    serie = models.ForeignKey(Serie, on_delete=models.PROTECT)
    nivel = models.ForeignKey(NivelEnsino, on_delete=models.PROTECT)

    status = models.CharField(max_length=15, choices=STATUS_CHOICES, default='ativo')
    ra = models.CharField(max_length=50, unique=True)

    data_matricula = models.DateTimeField(auto_now_add=True)
    matriculado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='matriculas_criadas'
    )
    

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='matriculas_atualizadas'
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['aluno'],
                condition=models.Q(status='ativo'),
                name='aluno_unico_ativo'
            )
        ]

    class Meta:
        verbose_name = "Matricula"
        verbose_name_plural = "Matriculas"
        unique_together = ('ra', 'turma')
        ordering = ['-data_matricula', '-id']
        indexes = [
            models.Index(fields=['-data_matricula']),
        ]

    def clean(self):
        if self.turma and self.serie:
            if self.turma.serie != self.serie:
                raise ValidationError({
                    'serie': "Série incompatível com a turma"
                })

        if self.turma and self.nivel:
            if self.turma.serie.nivel != self.nivel:
                raise ValidationError({
                    'nivel': "Nível incompatível com a turma"
                })

    def __str__(self):
        return f"{self.aluno.pessoa.nome_completo} - {self.turma.serie.nome} ({self.turma.ano_letivo})"
