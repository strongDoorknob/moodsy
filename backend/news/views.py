import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv  # type: ignore
from django.views.decorators.http import require_GET
from django.utils.dateparse import parse_datetime
from .models import NewsArticle

# Load environment variables
load_dotenv('.env.local')

# API keys
NEWSDATA_API_KEY = os.getenv("NEWSDATA_API_KEY", "pub_87254a7bf2122dcd6ed9152a57c9fd6c5534e")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def get_sentiment_external(text):
    api_url = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english"
    headers = {"Authorization": f"Bearer {HF_API_KEY}"}
    resp = requests.post(api_url, headers=headers, json={"inputs": text}, timeout=10)
    resp.raise_for_status()
    data = resp.json()
    # The model returns [{'label': 'POSITIVE', 'score': 0.99}, ...]
    label = data[0]['label'].lower()  # 'positive' or 'negative'
    # Convert to your previous categories
    if label == "positive":
        return "positive"
    elif label == "negative":
        return "negative"
    else:
        return "neutral"

# Map country codes to search terms
def map_country_to_query(country):
    country_mapping = {
        "us": "unitedstate",
        "th": "thailand",
        "jp": "japan",
        "kr": "korea",
        "cn": "china",
        "fr": "frances",
        "de": "germany",
        "es": "spain",
        "it": "italy",
        "ru": "russia",
        "br": "brazil",
        "au": "australia",
        "ca": "canada",
        "gb": "unitedkingdom",
        "mx": "mexico",
        "za": "southafrica",
        "ae": "unitedarabemirates",
        "ng": "nigeria",
        "id": "indonesia",
        "ph": "philippines",
        "sg": "singapore",
        "vn": "vietnam",
        "se": "sweden",
        "no": "norway",
        "fi": "finland",
        "dk": "denmark",
        # Add more mappings as needed
    }
    return country_mapping.get(country, country)

@csrf_exempt
def fetch_news_raw(request):
    country = request.GET.get("country", "").lower()
    language = request.GET.get("language", "").lower()
    
    if not country and not language:
        return JsonResponse({"error": "Country or language code is required"}, status=400)
    
    # Convert country code to appropriate search term
    query = map_country_to_query(country) if country else language
    
    url = f"https://newsdata.io/api/1/latest?apikey={NEWSDATA_API_KEY}&q={query}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("status") != "success":
            return JsonResponse({"error": f"NewsData API request failed: {data.get('results', {}).get('message')}"}, status=400)
        
        # Get first 3 articles only
        articles = data.get("results", [])[:3]
        
        results = [{
            "title": a.get("title"),
            "description": a.get("description"),
            "url": a.get("link"),
            "imageUrl": a.get("image_url"),
            "publishedAt": a.get("pubDate"),
        } for a in articles]
        
        return JsonResponse(results, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def fetch_news_with_sentiment(request):
    country = request.GET.get("country", "").lower()
    
    if not country:
        return JsonResponse({"error": "Country parameter is required"}, status=400)
    
    query = map_country_to_query(country)
    url = f"https://newsdata.io/api/1/latest?apikey={NEWSDATA_API_KEY}&q={query}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("status") != "success":
            return JsonResponse({"error": f"NewsData API request failed: {data.get('results', {}).get('message')}"}, status=400)
        
        articles = data.get("results", [])[:3]
        print(f"[{country}] Received {len(articles)} articles")
        
        results = []
        for a in articles:
            text = (a.get("title", "") + " " + (a.get("description") or "")).strip()
            try:
                sentiment = get_sentiment_external(text)
            except Exception as e:
                print(f"Sentiment analysis failed: {e}")
                sentiment = "neutral"
            
            # Save to DB
            published = parse_datetime(a.get("pubDate"))
            obj, created = NewsArticle.objects.get_or_create(
                url=a.get("link"),
                defaults={
                    "title": a.get("title"),
                    "description": a.get("description"),
                    "image_url": a.get("image_url"),
                    "published_at": published,
                    "sentiment": sentiment,
                    "country": country,
                }
            )
            results.append({
                "title": obj.title,
                "description": obj.description,
                "url": obj.url,
                "imageUrl": obj.image_url,
                "publishedAt": obj.published_at,
                "sentiment": obj.sentiment,
            })
        
        return JsonResponse({
            "status": "success",
            "totalResults": len(results),
            "results": results
        }, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
    
@require_GET
def get_stored_news(request):
    country = request.GET.get("country")
    language = request.GET.get("language")
    qs = NewsArticle.objects.all()
    if country:
        qs = qs.filter(country=country)
    if language:
        qs = qs.filter(language=language)
    results = [
        {
            "title": n.title,
            "description": n.description,
            "url": n.url,
            "imageUrl": n.image_url,
            "publishedAt": n.published_at,
            "sentiment": n.sentiment,
        }
        for n in qs.order_by('-published_at')[:10]
    ]
    return JsonResponse({"results": results})