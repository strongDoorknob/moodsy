// app/api/mood/route.ts
import { NextResponse } from 'next/server'

interface NewsArticle {
  title: string
  description: string | null
  url: string
}

interface ArticleWithSentiment extends NewsArticle {
  sentiment: 'positive' | 'neutral' | 'negative'
}

const HF_MODEL = 'siebert/sentiment-roberta-large-english';
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`
const LLM_MODEL = 'gpt-3.5-turbo'; // Or any other suitable LLM

// Map ISO codes to full country names for fallback search
const countryCodes: Record<string, string> = {
  'United States': 'us',
  'Thailand': 'th',
  'Japan': 'jp',
  'United Kingdom': 'gb',
  'Germany': 'de',
  'United States of America': 'us',
  'UK': 'gb',
  'Deutschland': 'de',
};

// Use a dynamic approach to get country names
const getCountryCode = (countryName: string): string => {
  const lowerCaseName = countryName.toLowerCase();
  for (const fullName in countryCodes) {
    if (lowerCaseName === fullName.toLowerCase()) {
      return countryCodes[fullName];
    }
  }
  return '';
};

// Function to interact with an LLM (replace with your actual LLM API call)
async function getCountryCodeFromLLM(countryName: string): Promise<string> {
  const llmKey = process.env.OPENAI_API_KEY; // Or your LLM API key
  if (!llmKey) {
    throw new Error('LLM API key is missing.');
  }

  const prompt = `What is the 2-letter ISO country code for ${countryName}?`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', { // Use the correct OpenAI endpoint
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${llmKey}`,
      },
      body: JSON.stringify({
        model: LLM_MODEL,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 10, // Adjust as needed
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API error:', errorData); // Log the error
      throw new Error(`LLM API request failed: ${response.status}`);
    }

    const data = await response.json();
    const llmResponse = data.choices[0]?.message?.content?.trim();
    console.log("LLM response", llmResponse)
    // Extract the country code from the LLM response (very basic extraction)
    const code = llmResponse?.slice(-2).toLowerCase(); // Get last 2 chars, lowercase
    if (code && code.length === 2) {
      return code;
    }
    return ''; // Return empty string if extraction fails

  } catch (error) {
    console.error('LLM request error:', error);
    return ''; // Return empty string on error
  }
}

export async function GET(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('country')
  const countryName = raw?.trim();
  if (!countryName) {
    return NextResponse.json({ error: 'Country parameter is required' }, { status: 400 })
  }

  const newsKey = process.env.NEWS_API_KEY!
  const hfKey = process.env.HUGGINGFACE_API_KEY!
  let articles: NewsArticle[] = []

  let countryCode = getCountryCode(countryName); // Try the static list first
  if (!countryCode) {
    countryCode = await getCountryCodeFromLLM(countryName); // If not found, ask the LLM
  }
  console.log(`Country Name: ${countryName}, Country Code: ${countryCode}`);

  // 1) Try top-headlines
  if (countryCode) {
    const res = await fetch(
      `https://newsapi.org/v2/top-headlines?country=${countryCode}&pageSize=3&apiKey=${newsKey}`
    )
    if (res.ok) {
      const json = await res.json()
      articles = (json.articles || []).map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
      }))
    }
  }

  // 2) Fallback to everything?q=Country Name if top-headlines fails
  if (articles.length === 0) {
    const res = await fetch(
      `https://newsapi.org/v2/everything?q=${encodeURIComponent(countryName)}&pageSize=3&apiKey=${newsKey}`
    )
    if (res.ok) {
      const json = await res.json()
      articles = (json.articles || []).map((a: any) => ({
        title: a.title,
        description: a.description,
        url: a.url,
      }))
    }
  }

  // 3) Analyze sentiment for each article
  const results = await Promise.all(
    articles.map(async (article) => {
      const text = article.description || article.title;
      console.log('Text for sentiment analysis:', text);
      try {
        const hfRes = await fetch(HF_ENDPOINT, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${hfKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ inputs: text }),
        });
        if (!hfRes.ok) throw new Error('HF analysis failed');
        const hfData: Array<{ label: string }> = await hfRes.json();
        console.log('Hugging Face API response:', hfData);
        const label = hfData[0]?.label;
        let sentiment: ArticleWithSentiment['sentiment'] = 'neutral';
        if (label === 'POSITIVE') sentiment = 'positive';
        if (label === 'NEGATIVE') sentiment = 'negative';
        return { ...article, sentiment };
      } catch (error) {
        console.error('Error during sentiment analysis:', error);
        return { ...article, sentiment: 'neutral' };
      }
    })
  );

  return NextResponse.json(results);
}
