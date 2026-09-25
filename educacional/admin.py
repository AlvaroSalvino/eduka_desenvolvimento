from django.contrib import admin
from .models import TipoGrade, NivelEnsino, Serie, Turno, Turma


@admin.register(TipoGrade)
class TipoGradeAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'quantidade_series',
        'sufixo',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
        'sufixo',
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

    autocomplete_fields = ('criado_por', 'atualizado_por')

    list_select_related = ('criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados da grade', {
            'fields': (
                'nome',
                'quantidade_series',
                'sufixo',
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


@admin.register(NivelEnsino)
class NivelEnsinoAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'tipo_grade',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
        'tipo_grade__nome',
    )

    list_filter = (
        'tipo_grade',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    autocomplete_fields = ('tipo_grade', 'criado_por', 'atualizado_por')

    list_select_related = ('tipo_grade', 'criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados do nível', {
            'fields': (
                'nome',
                'tipo_grade',
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


@admin.register(Serie)
class SerieAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'numero',
        'nivel',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
        'nivel__nome',
    )

    list_filter = (
        'nivel',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    autocomplete_fields = ('nivel', 'criado_por', 'atualizado_por')

    list_select_related = ('nivel', 'criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados da série', {
            'fields': (
                'nivel',
                'numero',
                'nome',
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


@admin.register(Turno)
class TurnoAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
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

    autocomplete_fields = ('criado_por', 'atualizado_por')

    list_select_related = ('criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados do turno', {
            'fields': (
                'nome',
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


@admin.register(Turma)
class TurmaAdmin(admin.ModelAdmin):
    list_display = (
        'nome',
        'serie',
        'turno',
        'ano_letivo',
        'capacidade',
        'criado_por',
        'data_criacao',
    )

    search_fields = (
        'nome',
        'serie__nome',
        'turno__nome',
        'ano_letivo',
    )

    list_filter = (
        'serie',
        'turno',
        'ano_letivo',
        'data_criacao',
    )

    readonly_fields = (
        'data_criacao',
        'data_atualizacao',
        'criado_por',
        'atualizado_por',
    )

    autocomplete_fields = ('serie', 'turno', 'criado_por', 'atualizado_por')

    list_select_related = ('serie', 'turno', 'criado_por', 'atualizado_por')

    fieldsets = (
        ('Dados da turma', {
            'fields': (
                'nome',
                'serie',
                'turno',
                'ano_letivo',
                'periodo_letivo',
                'capacidade',
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