from django.contrib.auth import authenticate, login as auth_login, get_user_model
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from .permissions import IsOwnerOrAdmin, ReadOnlyOrAdmin
from .models import Pessoa, Perfil
from .serializers import PessoaSerializer, PerfilSerializer

User = get_user_model()


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email")
        password = request.data.get("password")

        user = User.objects.filter(email=email).first()

        if not user:
            return Response(
                {"detail": "Credenciais inválidas"},
                status=status.HTTP_400_BAD_REQUEST
            )

        user = authenticate(request, username=user.username, password=password)

        if not user:
            return Response(
                {"detail": "Credenciais inválidas"},
                status=status.HTTP_400_BAD_REQUEST
            )

        auth_login(request, user)

        return Response({
            "message": "Login realizado com sucesso"
        })


class MeView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user

        if not user.is_active:
            return Response(
                {"detail": "Usuário inativo"},
                status=status.HTTP_403_FORBIDDEN
            )

        return Response({
            "id": user.id,
            "email": user.email,
            "username": user.username,
        })


class PessoaViewSet(viewsets.ModelViewSet):
    queryset = Pessoa.objects.all()
    serializer_class = PessoaSerializer
    permission_classes = [IsOwnerOrAdmin]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Pessoa.objects.none()

        try:
            perfil = user.perfil
        except:
            return Pessoa.objects.none()

        if perfil.tipo == 'admin':
            return Pessoa.objects.all().select_related(
                'criado_por', 'atualizado_por'
            )

        return Pessoa.objects.filter(
            criado_por=user
        ).select_related('criado_por', 'atualizado_por')


class PerfilViewSet(viewsets.ModelViewSet):
    queryset = Perfil.objects.all()
    serializer_class = PerfilSerializer
    permission_classes = [ReadOnlyOrAdmin]

    def get_queryset(self):
        user = self.request.user

        if not user.is_authenticated:
            return Perfil.objects.none()

        try:
            perfil = user.perfil
        except:
            return Perfil.objects.none()

        if perfil.tipo == 'admin':
            return Perfil.objects.all().select_related(
                'usuario', 'criado_por', 'atualizado_por'
            )

        return Perfil.objects.filter(usuario=user)