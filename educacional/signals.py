from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import NivelEnsino, Serie


@receiver(post_save, sender=NivelEnsino)
def criar_series(sender, instance, created, **kwargs):
    tipo = instance.tipo_grade
    existentes = instance.series.count()

    for i in range(existentes + 1, tipo.quantidade_series + 1):
        Serie.objects.create(
            nivel=instance,
            numero=i,
            nome=f"{i}º {tipo.sufixo}"
        )

    if existentes > tipo.quantidade_series:
        instance.series.filter(numero__gt=tipo.quantidade_series).delete()