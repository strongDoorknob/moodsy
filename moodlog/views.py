from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import SentimentLog
from .serializers import SentimentLogSerializer

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_sentiment(request):
    data = request.data.copy()
    data['user'] = request.user.id
    serializer = SentimentLogSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)