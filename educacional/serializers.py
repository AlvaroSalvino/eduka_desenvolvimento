from rest_framework import serializers
from .models import TipoGrade, NivelEnsino, Serie, Turno, Turma
from django.db import IntegrityError


class TipoGradeSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = TipoGrade
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
    
class NivelEnsinoSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = NivelEnsino
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
    

class SerieSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Serie
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
    

class TurnoSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Turno
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
    

class TurmaSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    nome_completo = serializers.SerializerMethodField()
    turno_por_extenso = serializers.SerializerMethodField()
    
    alunos_ativos = serializers.IntegerField(read_only=True)

    class Meta:
        model = Turma
        fields = '__all__'
        read_only_fields = (
            'data_criacao',
            'data_atualizacao',
            'criado_por',
            'atualizado_por',
        )

    def get_turno_por_extenso(self, obj):
        return f"{obj.turno.nome}"

    def get_nome_completo(self, obj):
        return f"{obj.serie.nome} {obj.nome}"

    def create(self, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['criado_por'] = request.user
            validated_data['atualizado_por'] = request.user

        try:
            return super().create(validated_data)

        except IntegrityError:
            raise serializers.ValidationError({
                "detail": "Já existe uma turma com esse nome, série, turno, ano letivo e período."
            })


    def update(self, instance, validated_data):
        request = self.context.get('request')

        if request and request.user.is_authenticated:
            validated_data['atualizado_por'] = request.user

        return super().update(instance, validated_data)