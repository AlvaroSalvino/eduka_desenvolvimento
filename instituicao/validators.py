import re
from django.core.exceptions import ValidationError


def validar_cnpj(value):
    cnpj = re.sub(r'[^0-9]', '', value)

    if len(cnpj) != 14:
        raise ValidationError('CNPJ deve conter 14 dígitos.')

    if cnpj == cnpj[0] * 14:
        raise ValidationError('CNPJ inválido.')

    def calcular_digito(cnpj, pesos):
        soma = sum(int(cnpj[i]) * pesos[i] for i in range(len(pesos)))
        resto = soma % 11
        return 0 if resto < 2 else 11 - resto

    pesos_1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
    pesos_2 = [6] + pesos_1

    digito1 = calcular_digito(cnpj[:12], pesos_1)
    digito2 = calcular_digito(cnpj[:12] + str(digito1), pesos_2)

    if digito1 != int(cnpj[12]) or digito2 != int(cnpj[13]):
        raise ValidationError('CNPJ inválido.')