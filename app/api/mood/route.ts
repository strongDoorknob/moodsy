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

const HF_MODEL    = 'siebert/sentiment-roberta-large-english'
const HF_ENDPOINT = `https://api-inference.huggingface.co/models/${HF_MODEL}`
const LLM_MODEL   = 'gpt-3.5-turbo'

// 1) ISO codes we allow directly:
const ISO_CODES = ['us','th','jp','gb','de','ca','fr','it','es','au'] as const

// 2) Full-name → code fallback:
const countryCodes: Record<string,string> = {
  'United States':          'us',
  'United States of America':'us',
  'UK':                     'gb',
  'United Kingdom':         'gb',
  'Germany':                'de',
  'Deutschland':            'de',
  'France':                 'fr',
  'Spain':                  'es',
  'Italy':                  'it',
  'Canada':                 'ca',
  'Australia':              'au',
  'Japan':                  'jp',
  'Thailand':               'th',
}

// 3) Language fallback map for top-headlines:
const languageMap: Record<string,string> = {
  us: 'en', gb: 'en', ca: 'en', au: 'en',
  fr: 'fr', de: 'de', es: 'es', it: 'it',
  jp: 'ja', th: 'th',
}

function getCountryCodeStatic(name: string): string {
  const lower = name.toLowerCase()
  // if already a 2-letter code:
  if (ISO_CODES.includes(lower as typeof ISO_CODES[number])) return lower
  // otherwise match full names:
  for (const full of Object.keys(countryCodes)) {
    if (lower === full.toLowerCase()) {
      return countryCodes[full]
    }
  }
  return ''
}

async function getCountryCodeFromLLM(countryName: string): Promise<string> {
  const llmKey = process.env.OPENAI_API_KEY
  if (!llmKey) throw new Error('Missing OPENAI_API_KEY')
  const prompt = `What is the 2-letter ISO country code for ${countryName}?`
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type':'application/json',
      'Authorization': `Bearer ${llmKey}`,
    },
    body: JSON.stringify({
      model: LLM_MODEL,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 10,
    }),
  })
  if (!res.ok) throw new Error(`LLM error ${res.status}`)
  const data = await res.json()
  const text = data.choices?.[0]?.message?.content?.trim() || ''
  const code = text.slice(-2).toLowerCase()
  return ISO_CODES.includes(code as typeof ISO_CODES[number]) ? code : ''
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const raw = searchParams.get('country')?.trim() || ''
  
  if (!raw) {
    return NextResponse.json(
      { error: 'Country parameter is required' }, 
      { status: 400 }
    )
  }

  // Validate API keys early
  const newsKey = process.env.NEWS_API_KEY
  const hfKey = process.env.HUGGINGFACE_API_KEY
  if (!newsKey) return NextResponse.json(
    { error: 'News API key missing' }, 
    { status: 500 }
  )
  if (!hfKey) return NextResponse.json(
    { error: 'Hugging Face key missing' }, 
    { status: 500 }
  )

  let code = getCountryCodeStatic(raw)
  let llmUsed = false

  // LLM fallback
  if (!code) {
    try {
      code = await getCountryCodeFromLLM(raw)
      llmUsed = true
    } catch (e) {
      console.error('LLM fallback failed:', e)
    }
  }

  console.log(`Country resolution: "${raw}" → code="${code}" (LLM: ${llmUsed})`)

  let articles: NewsArticle[] = []
  let apiRequests = []

  // Try different NewsAPI endpoints
  if (code) {
    apiRequests.push(
      fetch(`https://newsapi.org/v2/top-headlines?country=${code}&pageSize=3&apiKey=${newsKey}`)
        .then(async res => {
          if (!res.ok) return null
          const data = await res.json()
          return data.articles || []
        })
    )
    
    const lang = languageMap[code]
    if (lang) {
      apiRequests.push(
        fetch(`https://newsapi.org/v2/top-headlines?language=${lang}&pageSize=3&apiKey=${newsKey}`)
          .then(async res => {
            if (!res.ok) return null
            const data = await res.json()
            return data.articles || []
          })
      )
    }
  }

  // Add fallback search
  apiRequests.push(
    fetch(`https://newsapi.org/v2/everything?q=${encodeURIComponent(raw)}&pageSize=3&apiKey=${newsKey}`)
      .then(async res => {
        if (!res.ok) return null
        const data = await res.json()
        return data.articles || []
      })
  )

  // Process all API requests
  try {
    const results = await Promise.all(apiRequests)
    for (const result of results) {
      if (result && result.length > 0) {
        articles = result.map((a: any) => ({
          title: a.title,
          description: a.description,
          url: a.url,
        }))
        break
      }
    }
  } catch (e) {
    console.error('NewsAPI request failed:', e)
    return NextResponse.json(
      { error: 'Failed to fetch news articles' }, 
      { status: 500 }
    )
  }

  // Sentiment analysis with error handling
  const results: ArticleWithSentiment[] = []
  for (const article of articles) {
    try {
      const text = article.description ?? article.title
      const hfRes = await fetch(HF_ENDPOINT, {
        method: 'POST',
        headers: { Authorization: `Bearer ${hfKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ inputs: text }),
      })
      
      if (!hfRes.ok) throw new Error(`HF API: ${hfRes.status}`)
      
      const hfJson: { label: string }[] = await hfRes.json()
      const lbl = hfJson[0]?.label
      
      results.push({
        ...article,
        sentiment: lbl === 'POSITIVE' ? 'positive' 
          : lbl === 'NEGATIVE' ? 'negative' 
          : 'neutral'
      })
    } catch (e) {
      console.error('Sentiment analysis failed:', e)
      results.push({ ...article, sentiment: 'neutral' })
    }
  }

  return NextResponse.json(results)
}