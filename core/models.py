from django.db import models
from django.contrib.auth import get_user_model
from .validators import validar_cpf
User = get_user_model()
class Pessoa(models.Model):
    SEXO_CHOICES = [
        ('masculino', 'Masculino'),
        ('feminino', 'Feminino'),
        ('outro', 'Outro'),
    ]
    COR_RACA_CHOICES = [
        ('branca', 'Branca'),
        ('preta', 'Preta'),
        ('parda', 'Parda'),
        ('amarela', 'Amarela'),
        ('indigena', 'Indígena'),
        ('nao_informado', 'Não informado'),
    ]
    nome_completo = models.CharField(max_length=120)
    data_nascimento = models.DateField()
    sexo = models.CharField(max_length=9, choices=SEXO_CHOICES)
    cpf = models.CharField(max_length=11, unique=True, validators=[validar_cpf])
    rg = models.CharField(max_length=15, blank=True, null=True)
    orgao_emissor = models.CharField(max_length=15, blank=True, null=True)
    data_emissao_rg = models.DateField(blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    telefone = models.CharField(max_length=20, blank=True, null=True)
    celular = models.CharField(max_length=20, blank=True, null=True)
    cep = models.CharField(max_length=9, blank=True, null=True)
    rua = models.CharField(max_length=140, blank=True, null=True)
    numero = models.CharField(max_length=8, blank=True, null=True)
    complemento = models.CharField(max_length=60, blank=True, null=True)
    bairro = models.CharField(max_length=80, blank=True, null=True)
    cidade = models.CharField(max_length=32, blank=True, null=True)
    estado = models.CharField(max_length=2, blank=True, null=True)
    cor_raca = models.CharField(max_length=30,choices=COR_RACA_CHOICES, blank=True, null=True)
    foto = models.ImageField(upload_to='profile_images/', null=True, blank=True)
    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pessoas_criadas'
    )
    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='pessoas_atualizadas'
    )
    observacoes = models.TextField(blank=True, null=True)
    class Meta:
        verbose_name = "Pessoa"
        verbose_name_plural = "Pessoas"
        ordering = ['-data_criacao', '-id']
        indexes = [
            models.Index(fields=['-data_criacao']),
        ]
    @property
    def foto_url(self):
        try:
            return self.foto.url if self.foto else None
        except:
            return None
    def __str__(self):
        return self.nome_completo
class Perfil(models.Model):
    TIPO_CHOICES = [
        ('admin', 'Admin'),
        ('user', 'User'),
    ]
    usuario = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    pessoa = models.OneToOneField(Pessoa, on_delete=models.CASCADE, related_name='perfil_pessoa')
    tipo = models.CharField(max_length=5, choices=TIPO_CHOICES)
    data_criacao = models.DateTimeField(auto_now_add=True)
    criado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='perfis_criados'
    )
    data_atualizacao = models.DateTimeField(auto_now=True)
    atualizado_por = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='perfis_atualizados'
    )
    class Meta:
        verbose_name = "Perfil"
        verbose_name_plural = "Perfis"
        ordering = ['-data_criacao', '-id']
        indexes = [
            models.Index(fields=['-data_criacao']),
        ]
    def __str__(self):
        return self.pessoa.nome_completo