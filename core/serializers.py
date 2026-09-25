from rest_framework import serializers
from .models import Pessoa, Perfil


class PessoaSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    cpf_formatado = serializers.SerializerMethodField()

    class Meta:
        model = Pessoa
        fields = '__all__'
        read_only_fields = (
            'data_criacao',
            'data_atualizacao',
            'criado_por',
            'atualizado_por',
        )

    def get_cpf_formatado(self, obj):
        if not obj.cpf or len(obj.cpf) != 11:
            return obj.cpf

        return f"{obj.cpf[:3]}.{obj.cpf[3:6]}.{obj.cpf[6:9]}-{obj.cpf[9:]}"

    def validate_cpf(self, value):
        return value.replace('.', '').replace('-', '')

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


class PerfilSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = Perfil
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