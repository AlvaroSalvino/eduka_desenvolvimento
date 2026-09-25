from django.db import models
from .validators import validar_cnpj
from django.contrib.auth import get_user_model

User = get_user_model()

class Ies(models.Model):
    nome = models.CharField(max_length=120)
    cnpj = models.CharField(max_length=14, unique=True, validators=[validar_cnpj])
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    url = models.CharField(max_length=255)

    cep = models.CharField(max_length=9, blank=True, null=True)
    rua = models.CharField(max_length=140, blank=True, null=True)
    numero = models.CharField(max_length=8, blank=True, null=True)
    complemento = models.CharField(max_length=60, blank=True, null=True)
    bairro = models.CharField(max_length=80, blank=True, null=True)
    cidade = models.CharField(max_length=32, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)

    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ies_criadas'
    )

    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='ies_atualizadas'
    )
    
    class Meta:
        verbose_name = "Instituição de Ensino"
        verbose_name_plural = "Instituições de Ensino"
        ordering = ['-data_criacao', '-id']
        indexes = [
            models.Index(fields=['-data_criacao']),
        ]