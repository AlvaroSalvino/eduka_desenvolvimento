from django.apps import AppConfig


class EducacionalConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'educacional'

    def ready(self):
        import educacional.signals