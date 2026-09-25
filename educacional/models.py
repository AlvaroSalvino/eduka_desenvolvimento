from django.db import models
from django.contrib.auth import get_user_model
from django.db.models import Q, UniqueConstraint

User = get_user_model()

class TipoGrade(models.Model):
    nome = models.CharField(
        max_length=100,
        help_text="Ex: Anual, Semestral, Modular"
    )

    quantidade_series = models.PositiveIntegerField(
        help_text="Quantidade total de etapas (ex: 3, 8, 9)"
    )

    sufixo = models.CharField(
        max_length=50,
        help_text="Ex: Ano, Semestre, Módulo"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='tipos_grade_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='tipos_grade_atualizados'
    )

    class Meta:
        verbose_name = "Tipo de Grade"
        verbose_name_plural = "Tipos de Grade"
        ordering = ['nome']
        indexes = [
            models.Index(fields=['-quantidade_series']),
        ]

    def __str__(self):
        return self.nome


class NivelEnsino(models.Model):
    nome = models.CharField(
        max_length=100,
        help_text="Ex: Ensino Médio, Ensino Fundamental"
    )

    tipo_grade = models.ForeignKey(
        TipoGrade,
        on_delete=models.PROTECT,
        related_name="niveis"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='niveis_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True,
        related_name='niveis_atualizados'
    )

    class Meta:
        verbose_name = "Nível de Ensino"
        verbose_name_plural = "Níveis de Ensino"
        ordering = ["tipo_grade", "nome"]
        indexes = [
            models.Index(fields=['tipo_grade', 'nome'])
        ]
        

    def __str__(self):
        return self.nome


class Serie(models.Model):
    nivel = models.ForeignKey(
        NivelEnsino,
        on_delete=models.CASCADE,
        related_name="series"
    )

    numero = models.PositiveIntegerField()

    nome = models.CharField(
        max_length=100,
        help_text="Ex: 1º Ano, 2º Semestre"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='series_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='series_atualizados'
    )

    class Meta:
        verbose_name = "Série"
        verbose_name_plural = "Séries"
        unique_together = ("nivel", "numero")
        ordering = ["numero"]

    def __str__(self):
        return f"{self.nome} - {self.nivel.nome}"
    

class Turno(models.Model):
    nome = models.CharField(
        max_length=50,
        help_text="Manhã, Tarde"
    )

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turnos_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turnos_atualizados'
    )

    class Meta:
        verbose_name = "Turno"
        verbose_name_plural = "Turnos"
        ordering = ['-data_criacao', '-id']
        indexes = [
            models.Index(fields=['-data_criacao']),
        ]

    def __str__(self):
        return f"{self.nome}"


class Turma(models.Model):
    nome = models.CharField(max_length=10, help_text="A, B, C...")

    serie = models.ForeignKey(
        Serie,
        on_delete=models.CASCADE,
        related_name="turmas"
    )

    turno = models.ForeignKey(
        Turno,
        on_delete=models.PROTECT
    )

    ano_letivo = models.PositiveIntegerField()
    periodo_letivo = models.PositiveIntegerField(null=True, blank=True)
    capacidade = models.PositiveIntegerField()

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turmas_criados'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='turmas_atualizados'
    )


    class Meta:
        verbose_name = "Turma"
        verbose_name_plural = "Turmas"
        ordering = ['serie', 'ano_letivo', 'periodo_letivo']

        constraints = [
            # Regra quando período NÃO é nulo
            UniqueConstraint(
                fields=["nome", "serie", "turno", "ano_letivo", "periodo_letivo"],
                name="unique_turma_com_periodo",
                condition=Q(periodo_letivo__isnull=False),
            ),

            # Regra quando período É nulo
            UniqueConstraint(
                fields=["nome", "serie", "turno", "ano_letivo"],
                name="unique_turma_sem_periodo",
                condition=Q(periodo_letivo__isnull=True),
            ),
        ]
        indexes = [
            models.Index(fields=['serie']),
        ]


    def __str__(self):
        return f"{self.serie.nome} {self.nome} - {self.turno.nome} ({self.ano_letivo})"