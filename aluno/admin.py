from django.contrib import admin
from .models import Aluno, Matricula


@admin.register(Aluno)
class AlunoAdmin(admin.ModelAdmin):
    list_display = (
        'get_nome_aluno',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'pessoa__nome_completo',
        'pessoa__cpf',
        'pessoa__email',
    )

    list_filter = (
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    autocomplete_fields = ('pessoa', 'criado_por', 'atualizado_por')

    list_select_related = ('pessoa', 'criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados do aluno', {
            'fields': (
                'pessoa',
                'observacoes',
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

    def get_nome_aluno(self, obj):
        return obj.pessoa.nome_completo
    get_nome_aluno.short_description = 'Aluno'

    def save_model(self, request, obj, form, change):
        if not obj.criado_por:
            obj.criado_por = request.user

        obj.atualizado_por = request.user
        super().save_model(request, obj, form, change)


@admin.register(Matricula)
class MatriculaAdmin(admin.ModelAdmin):
    list_display = (
        'ra',
        'get_nome_aluno',
        'turma',
        'serie',
        'nivel',
        'status',
        'data_matricula',
    )

    search_fields = (
        'ra',
        'aluno__pessoa__nome_completo',
    )

    list_filter = (
        'status',
        'nivel',
        'serie',
        'turma',
        'data_matricula',
    )

    readonly_fields = (
        'data_matricula',
        'data_atualizacao',
        'matriculado_por',
        'atualizado_por',
    )

    autocomplete_fields = (
        'aluno',
        'turma',
        'serie',
        'nivel',
        'matriculado_por',
        'atualizado_por',
    )

    list_select_related = (
        'aluno',
        'aluno__pessoa',
        'turma',
        'serie',
        'nivel',
        'matriculado_por',
        'atualizado_por',
    )

    fieldsets = (
        ('Dados da matrícula', {
            'fields': (
                'aluno',
                'turma',
                'serie',
                'nivel',
                'ra',
                'status',
            )
        }),
        ('Controle', {
            'fields': (
                'data_matricula',
                'matriculado_por',
            )
        }),
        ('Sistema', {
            'fields': (
                'atualizado_por',
                'data_atualizacao',
            )
        }),
    )

    def get_nome_aluno(self, obj):
        return obj.aluno.pessoa.nome_completo
    get_nome_aluno.short_description = 'Aluno'

    def save_model(self, request, obj, form, change):
        if not obj.matriculado_por:
            obj.matriculado_por = request.user

        obj.atualizado_por = request.user
        super().save_model(request, obj, form, change)