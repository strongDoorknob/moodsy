from django.urls import path
from .views import fetch_news_raw, fetch_news_with_sentiment, get_stored_news

urlpatterns = [
    path("news/", fetch_news_raw, name="fetch_news_raw"),
    path("sentiment/", fetch_news_with_sentiment, name="fetch_news_with_sentiment"),
    path('stored/', get_stored_news, name='get_stored_news'),
]