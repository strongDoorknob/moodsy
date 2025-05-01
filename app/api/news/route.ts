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
    const country = searchParams.get('country')?.toLowerCase()
    const language = searchParams.get('language')?.toLowerCase()

    if (!country && !language) {
      return NextResponse.json({ error: 'Country or language code is required' }, { status: 400 })
    }

    const apiKey = process.env.NEWS_API_KEY
    if (!apiKey) throw new Error('Missing NEWS_API_KEY in environment')

    const baseUrl = 'https://newsapi.org/v2/top-headlines'
    const queryParam = country
      ? `country=${country}`
      : language
        ? `language=${language}`
        : ''
    const url = `${baseUrl}?${queryParam}&pageSize=10&apiKey=${apiKey}`

    const newsRes = await fetch(url)
    if (!newsRes.ok) {
      return NextResponse.json(
        { error: `NewsAPI request failed: ${newsRes.status}` },
        { status: newsRes.status }
      )
    }

    const newsData: { articles?: NewsApiArticle[] } = await newsRes.json()

    // Fallback to language if country returned no articles
    if ((!newsData.articles || newsData.articles.length === 0) && country) {
      console.warn(`No articles for country "${country}", trying fallback with language...`)
      const languageMap: Record<string, string> = {
        jp: 'ja',
        th: 'th',
        de: 'de',
        us: 'en',
        gb: 'en',
      }
      const fallbackLang = languageMap[country]

      if (fallbackLang) {
        const fallbackUrl = `${baseUrl}?language=${fallbackLang}&pageSize=10&apiKey=${apiKey}`
        const fallbackRes = await fetch(fallbackUrl)
        const fallbackData: { articles?: NewsApiArticle[] } = await fallbackRes.json()

        const fallbackArticles: Article[] = (fallbackData.articles || []).map((a) => ({
          title: a.title,
          description: a.description,
          url: a.url,
          imageUrl: a.urlToImage,
          publishedAt: a.publishedAt,
        }))

        return NextResponse.json(fallbackArticles)
      }
    }

    const articles: Article[] = (newsData.articles || []).map((a) => ({
      title: a.title,
      description: a.description,
      url: a.url,
      imageUrl: a.urlToImage,
      publishedAt: a.publishedAt,
    }))

    return NextResponse.json(articles)
  } catch (err: unknown) {
    console.error('News API error:', err)
    const msg = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
