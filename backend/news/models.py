from django.db import models

class NewsArticle(models.Model):
    title = models.CharField(max_length=512)
    description = models.TextField(blank=True, null=True)
    url = models.URLField()
    image_url = models.URLField(blank=True, null=True)
    published_at = models.DateTimeField()
    sentiment = models.CharField(max_length=16)  # 'positive', 'neutral', 'negative'
    country = models.CharField(max_length=8, blank=True, null=True)
    language = models.CharField(max_length=8, blank=True, null=True)

    def __str__(self):
        return self.title