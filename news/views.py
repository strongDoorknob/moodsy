import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv  # type: ignore

from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch # type: ignore
import torch.nn.functional as F # type: ignore

# Load environment variables
load_dotenv('.env.local')

# API keys
NEWS_API_KEY = os.getenv("NEWS_API_KEY")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
print(NEWS_API_KEY, HF_API_KEY, OPENAI_API_KEY)

# Load sentiment model (nlptown)
tokenizer = AutoTokenizer.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")

@csrf_exempt
def fetch_news_raw(request):
    country = request.GET.get("country", "").lower()
    language = request.GET.get("language", "").lower()

    if not country and not language:
        return JsonResponse({"error": "Country or language code is required"}, status=400)

    url = f"https://newsapi.org/v2/top-headlines?{'country=' + country if country else 'language=' + language}&pageSize=10&apiKey={NEWS_API_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        if not response.ok:
            return JsonResponse({"error": f"NewsAPI request failed: {data.get('message')}"}, status=response.status_code)

        articles = data.get("articles", [])
        results = [{
            "title":       a.get("title"),
            "description": a.get("description"),
            "url":         a.get("url"),
            "imageUrl":    a.get("urlToImage"),
            "publishedAt": a.get("publishedAt"),
        } for a in articles]

        return JsonResponse(results, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def fetch_news_with_sentiment(request):
    country = request.GET.get("country", "").lower()
    if not country:
        return JsonResponse({"error": "Country parameter is required"}, status=400)

    url = f"https://newsapi.org/v2/top-headlines?country={country}&pageSize=3&apiKey={NEWS_API_KEY}"
    try:
        response = requests.get(url)
        data = response.json()
        if not response.ok:
            return JsonResponse({"error": f"NewsAPI request failed: {data.get('message')}"}, status=response.status_code)

        articles = data.get("articles", [])
        print(f"[{country}] Received {len(articles)} articles")

        results = []
        for a in articles:
            text = (a.get("title", "") + " " + (a.get("description") or "")).strip()
            sentiment = "neutral"

            try:
                inputs = tokenizer(text, return_tensors="pt", truncation=True, padding=True)
                with torch.no_grad():
                    outputs = model(**inputs)
                    probs = F.softmax(outputs.logits, dim=1)
                    score = torch.argmax(probs, dim=1).item() + 1  
                    if score <= 2:
                        sentiment = "negative"
                    elif score == 3:
                        sentiment = "neutral"
                    else:
                        sentiment = "positive"
            except Exception as e:
                print(f"Sentiment analysis failed: {e}")
                sentiment = "neutral"

            results.append({
                "title": a.get("title"),
                "description": a.get("description"),
                "url": a.get("url"),
                "imageUrl": a.get("urlToImage"),
                "publishedAt": a.get("publishedAt"),
                "sentiment": sentiment,
            })

        return JsonResponse(results, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)