from rest_framework import serializers
from .models import Aluno, Matricula


class AlunoSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Aluno
        fields = '__all__'
        read_only_fields = (
            'data_criacao',
            'data_atualizacao',
            'criado_por',
            'atualizado_por',
        )

    def create(self, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['criado_por'] = request.user
            validated_data['atualizado_por'] = request.user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['atualizado_por'] = request.user

        return super().update(instance, validated_data)


class AlunoListSerializer(serializers.ModelSerializer):
    nome_completo = serializers.CharField(
        source='aluno.pessoa.nome_completo',
        read_only=True
    )

    email = serializers.CharField(
        source='aluno.pessoa.email',
        read_only=True,
        allow_null=True
    )

    ra = serializers.CharField(read_only=True)
    status = serializers.CharField(read_only=True)

    serie = serializers.CharField(
        source='turma.serie.nome',
        read_only=True
    )

    turma = serializers.CharField(
        source='turma.nome',
        read_only=True
    )

    turno = serializers.CharField(
        source='turma.turno.nome',
        read_only=True
    )

    class Meta:
        model = Matricula
        fields = [
            'id',
            'nome_completo',
            'email',
            'ra',
            'status',
            'serie',
            'turma',
            'turno',
        ]

class MatriculaSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    nome_aluno = serializers.CharField(source='aluno.pessoa.nome_completo', read_only=True)
    email = serializers.CharField(source='aluno.pessoa.email', read_only=True)

    nome_turma = serializers.SerializerMethodField()
    serie_nome = serializers.CharField(source='turma.serie.nome', read_only=True)
    turno_nome = serializers.CharField(source='turma.turno.nome', read_only=True)

    class Meta:
        model = Matricula
        fields = [
            'id',
            'aluno',
            'turma',
            'serie',
            'nivel',
            'status',
            'ra',
            'nome_aluno',
            'email',
            'nome_turma',
            'turno',
        ]
        read_only_fields = (
            'data_criacao',
            'data_atualizacao',
            'criado_por',
            'atualizado_por',
        )

    def get_nome_turma(self, obj):
        return f"{obj.turma.serie.nome} {obj.turma.nome}"

    def create(self, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['criado_por'] = request.user
            validated_data['atualizado_por'] = request.user

        return super().create(validated_data)

    def update(self, instance, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['atualizado_por'] = request.user

        return super().update(instance, validated_data)