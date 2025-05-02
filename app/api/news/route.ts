// app/api/news/route.ts
import { NextResponse } from 'next/server'

interface NewsApiArticle {
  source: { id: string | null; name: string }
  author: string | null
  title: string
  description: string | null
  url: string
  urlToImage: string | null
  publishedAt: string
  content: string | null
}

interface Article {
  title: string
  description: string | null
  url: string
  imageUrl?: string | null
  publishedAt?: string
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url)
    const country  = searchParams.get('country')?.toLowerCase()
    const language = searchParams.get('language')?.toLowerCase()

    if (!country && !language) {
      return NextResponse.json(
        { error: 'Country or language code is required' },
        { status: 400 }
      )
    }

    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) throw new Error('Missing NEWS_API_KEY in environment')

    const baseUrl   = 'https://newsapi.org/v2/top-headlines'
    const queryParam = country
      ? `country=${country}`
      : `language=${language}`
    const url = `${baseUrl}?${queryParam}&pageSize=10&apiKey=${apiKey}`

    // 1) Try top-headlines by country or language
    const newsRes  = await fetch(url)
    const newsData = await newsRes.json()
    if (!newsRes.ok) {
      return NextResponse.json(
        { error: `NewsAPI request failed: ${newsRes.status}` },
        { status: newsRes.status }
      )
    }

    let articles: NewsApiArticle[] = newsData.articles || []

    // 2) If country-based and got zero, fall back to language
    if (country && articles.length === 0) {
      console.warn(`No articles for country="${country}", trying language fallback...`)
      const languageMap: Record<string, string> = {
        jp: 'ja', th: 'th', de: 'de', us: 'en', gb: 'en',
      }
      const fallbackLang = languageMap[country] ?? language

      const langUrl = `${baseUrl}?language=${fallbackLang}&pageSize=10&apiKey=${apiKey}`
      const langRes = await fetch(langUrl)
      const langData = await langRes.json()
      if (langRes.ok) {
        articles = langData.articles || []
      }
    }

    // 3) If still empty, fallback to everything?q=country
    if (articles.length === 0 && country) {
      console.warn(`Still no articles, falling back to everything?q=${country}`)
      const everythingUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(country)}&pageSize=10&apiKey=${apiKey}`
      const allRes = await fetch(everythingUrl)
      const allData = await allRes.json()
      if (allRes.ok) {
        articles = allData.articles || []
      }
    }

    // 4) Map to your Article shape
    const output: Article[] = articles.map(a => ({
      title:       a.title,
      description: a.description,
      url:         a.url,
      imageUrl:    a.urlToImage,
      publishedAt: a.publishedAt,
    }))

    return NextResponse.json(output)
  } catch (err: unknown) {
    console.error('News API error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
