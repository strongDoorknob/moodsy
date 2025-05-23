from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken # type: ignore

from .models import UserProfile

@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    email = request.data.get('email')
    password = request.data.get('password')

    if not email or not password:
        return Response({'detail': 'Email and password are required.'}, status=400)

    if User.objects.filter(username=email).exists():
        return Response({'detail': 'User already exists.'}, status=400)

    user = User.objects.create_user(username=email, email=email, password=password)
    # UserProfile is auto-created via signal
    return Response({'detail': 'User created successfully.'}, status=201)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(username=email, password=password)

    if user is None:
        return Response({'detail': 'Invalid credentials'}, status=401)

    refresh = RefreshToken.for_user(user)
    return Response({
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    profile = getattr(request.user, 'profile', None)
    return Response({
        'email': request.user.email,
        'id': request.user.id,
        'isPro': profile.is_pro if profile else False
    })

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upgrade_to_pro(request):
    profile = getattr(request.user, 'profile', None)
    if not profile:
        return Response({'detail': 'No profile found'}, status=404)

    profile.is_pro = True
    profile.save()
    return Response({'detail': 'User upgraded to Pro successfully.', 'isPro': True})