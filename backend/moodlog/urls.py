from django.urls import path
from .views import log_sentiment

urlpatterns = [
    path('log_sentiment/', log_sentiment),
]