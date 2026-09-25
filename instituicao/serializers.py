from rest_framework import serializers
from .models import Ies


class IesSerializer(serializers.ModelSerializer):
    criado_por = serializers.StringRelatedField(read_only=True)
    atualizado_por = serializers.StringRelatedField(read_only=True)

    cnpj_formatado = serializers.SerializerMethodField()

    class Meta:
        model = Ies
        fields = '__all__'
        read_only_fields = (
            'data_criacao',
            'data_atualizacao',
            'criado_por',
            'atualizado_por',
        )

    def get_cnpj_formatado(self, obj):
        if not obj.cnpj or len(obj.cnpj) != 14:
            return obj.cnpj

        return f"{obj.cnpj[:2]}.{obj.cnpj[2:5]}.{obj.cnpj[5:8]}/{obj.cnpj[8:12]}-{obj.cnpj[12:14]}"

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