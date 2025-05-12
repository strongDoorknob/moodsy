from django.urls import path
from .views import fetch_news_raw, fetch_news_with_sentiment

urlpatterns = [
    path("news/", fetch_news_raw, name="fetch_news_raw"),
    path("sentiment/", fetch_news_with_sentiment, name="fetch_news_with_sentiment"),
]