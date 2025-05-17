import os
import requests
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from dotenv import load_dotenv  # type: ignore
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import torch  # type: ignore
import torch.nn.functional as F  # type: ignore

# Load environment variables
load_dotenv('.env.local')

# API keys
NEWSDATA_API_KEY = os.getenv("NEWSDATA_API_KEY", "pub_87254a7bf2122dcd6ed9152a57c9fd6c5534e")
HF_API_KEY = os.getenv("HUGGINGFACE_API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

# Load sentiment model (nlptown)
tokenizer = AutoTokenizer.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")
model = AutoModelForSequenceClassification.from_pretrained("nlptown/bert-base-multilingual-uncased-sentiment")

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
    
    # Convert country code to appropriate search term
    query = map_country_to_query(country)
    
    url = f"https://newsdata.io/api/1/latest?apikey={NEWSDATA_API_KEY}&q={query}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("status") != "success":
            return JsonResponse({"error": f"NewsData API request failed: {data.get('results', {}).get('message')}"}, status=400)
        
        # Get first 3 articles only
        articles = data.get("results", [])[:3]
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
                "url": a.get("link"),
                "imageUrl": a.get("image_url"),
                "publishedAt": a.get("pubDate"),
                "sentiment": sentiment,
            })
        
        return JsonResponse({
            "status": "success",
            "totalResults": len(results),
            "results": results
        }, safe=False)
    
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)