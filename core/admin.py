from django.contrib import admin
from django.utils.html import format_html
from .models import Pessoa, Perfil


@admin.register(Pessoa)
class PessoaAdmin(admin.ModelAdmin):
    list_display = (
        'nome_completo',
        'cpf',
        'sexo',
        'email',
        'cidade',
        'estado',
        'criado_por',
        'data_criacao',
        'preview_foto',
    )

    search_fields = (
        'nome_completo',
        'cpf',
        'email',
    )

    list_filter = (
        'sexo',
        'cor_raca',
        'estado',
        'cidade',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
        'preview_foto',
    )

    autocomplete_fields = ('criado_por', 'atualizado_por')

    list_select_related = ('criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados pessoais', {
            'fields': (
                'nome_completo',
                'data_nascimento',
                'sexo',
                'cor_raca',
                'cpf',
                'rg',
                'orgao_emissor',
                'data_emissao_rg',
                'foto',
                'preview_foto',
            )
        }),
        ('Contato', {
            'fields': (
                'email',
                'telefone',
                'celular',
            )
        }),
        ('Endereço', {
            'fields': (
                'cep',
                'rua',
                'numero',
                'complemento',
                'bairro',
                'cidade',
                'estado',
            )
        }),
        ('Sistema', {
            'fields': (
                'criado_por',
                'atualizado_por',
                'data_criacao',
                'data_atualizacao',
            )
        }),
        ('Observações', {
            'fields': ('observacoes',)
        }),
    )

    def preview_foto(self, obj):
        if obj.foto_url:
            return format_html('<img src="{}" width="50" height="50" style="border-radius:50%;" />', obj.foto_url)
        return "-"
    preview_foto.short_description = "Foto"

    def save_model(self, request, obj, form, change):
        if not obj.criado_por:
            obj.criado_por = request.user

        obj.atualizado_por = request.user
        super().save_model(request, obj, form, change)


@admin.register(Perfil)
class PerfilAdmin(admin.ModelAdmin):
    list_display = (
        'usuario',
        'get_nome_pessoa',
        'tipo',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'usuario__username',
        'usuario__email',
        'pessoa__nome_completo',
    )

    list_filter = (
        'tipo',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    autocomplete_fields = ('usuario', 'pessoa', 'criado_por', 'atualizado_por')

    list_select_related = ('usuario', 'pessoa', 'criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados do perfil', {
            'fields': (
                'usuario',
                'pessoa',
                'tipo',
            )
        }),
        ('Sistema', {
            'fields': (
                'criado_por',
                'atualizado_por',
                'data_criacao',
                'data_atualizacao',
            )
        }),
    )

    def get_nome_pessoa(self, obj):
        return obj.pessoa.nome_completo
    get_nome_pessoa.short_description = 'Pessoa'

    def save_model(self, request, obj, form, change):
        if not obj.criado_por:
            obj.criado_por = request.user

        obj.atualizado_por = request.user
        super().save_model(request, obj, form, change)