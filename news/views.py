# general/views.py
import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv # type: ignore

load_dotenv()

NEWS_API_KEY = os.getenv("NEWS_API_KEY")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

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
        results = []
        for a in articles:
            text = (a.get("title", "") + " " + (a.get("description") or "")).strip()

            # Call OpenAI LLM for sentiment
            llm_res = requests.post(
                "https://api.openai.com/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {OPENAI_API_KEY}",
                    "Content-Type": "application/json",
                },
                json={
                    "model": "gpt-3.5-turbo",
                    "messages": [
                        {
                            "role": "user",
                            "content": f'Classify the sentiment of this news article as Positive, Neutral, or Negative:\n\n"{text}"\n\nSentiment:',
                        }
                    ],
                    "temperature": 0,
                    "max_tokens": 10,
                },
            )
            sentiment = "neutral"
            if llm_res.ok:
                raw = llm_res.json()["choices"][0]["message"]["content"].strip().lower()
                if "positive" in raw:
                    sentiment = "positive"
                elif "negative" in raw:
                    sentiment = "negative"

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