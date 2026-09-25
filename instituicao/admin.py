from django.contrib import admin
from .models import Ies


@admin.register(Ies)
class IesAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'cnpj',
        'cidade',
        'estado',
        'criado_por',
        'atualizado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
        'cnpj',
        'email',
    )

    list_filter = (
        'estado',
        'cidade',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    fieldsets = (
        ('Dados da instituição', {
            'fields': (
                'nome',
                'cnpj',
                'email',
                'telefone',
                'url',
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
    )

    def save_model(self, request, obj, form, change):
        if not obj.criado_por:
            obj.criado_por = request.user

        obj.atualizado_por = request.user
        super().save_model(request, obj, form, change)