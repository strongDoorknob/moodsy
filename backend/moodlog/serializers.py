from rest_framework import serializers
from .models import SentimentLog

class SentimentLogSerializer(serializers.ModelSerializer):
    class Meta:
        model = SentimentLog
        fields = '__all__'
        read_only_fields = ['user', 'created_at']