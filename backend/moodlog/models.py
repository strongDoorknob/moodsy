from django.db import models
from django.contrib.auth.models import User

class SentimentLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    country_code = models.CharField(max_length=10)
    article_title = models.TextField()
    article_description = models.TextField(blank=True, null=True)
    article_url = models.URLField()
    sentiment = models.CharField(max_length=10)  # positive, neutral, negative
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.country_code} - {self.sentiment}"