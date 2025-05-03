// components/ComparisonDashboard.tsx
import { useEffect, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
// import { Button } from '@/components/ui/button'
import html2canvas from 'html2canvas'

type DataPoint = {
  date: string
  [country: string]: number | string
}

interface ComparisonDashboardProps {
  countries: string[]
  apiUrl?: string
}

export default function ComparisonDashboard({ countries, apiUrl = '/api/mood' }: ComparisonDashboardProps) {
  const [data, setData] = useState<DataPoint[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const queries = countries.map(c => `country=${c}`).join('&')
        const res = await fetch(`${apiUrl}?${queries}`)
        const articles = await res.json()
        const byDate: Record<string, Record<string, number[]>> = {}
        articles.forEach((a: any) => {
          const date = new Date(a.publishedAt).toISOString().split('T')[0]
          if (!byDate[date]) byDate[date] = {}
          if (!byDate[date][a.country]) byDate[date][a.country] = []
          const score = a.sentiment === 'positive' ? 1 : a.sentiment === 'negative' ? -1 : 0
          byDate[date][a.country].push(score)
        })
        const chartData: DataPoint[] = Object.entries(byDate).map(([date, obj]) => {
          const point: any = { date }
          countries.forEach(c => {
            const arr = obj[c] || []
            const avg = arr.length ? arr.reduce((a,b) => a+b, 0)/arr.length : 0
            point[c] = parseFloat(avg.toFixed(2))
          })
          return point
        }).sort((a,b) => a.date.localeCompare(b.date))
        setData(chartData)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [countries, apiUrl])

  const handleSnapshot = async () => {
    const node = document.getElementById('chart-container')
    if (!node) return
    const canvas = await html2canvas(node)
    const url = canvas.toDataURL('image/png')
    const link = document.createElement('a')
    link.href = url
    link.download = `snapshot-${countries.join('-')}.png`
    link.click()
  }

  return (
    <div className="p-4 bg-white rounded-2xl shadow">
      <div id="chart-container" className="w-full h-64">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {countries.map(c => (
                <Line
                  key={c}
                  type="monotone"
                  dataKey={c}
                  strokeWidth={2}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
      {/* <div className="mt-4 flex space-x-2">
        <Button onClick={handleSnapshot}>Save Snapshot</Button>
        <Button asChild>
          <a
            href={`${window.location.href}`}
            target="_blank"
          >
            Share Link
          </a>
        </Button>
      </div> */}
    </div>
)}

// // pages/embed/[countries].tsx
// import React from 'react'
// import { useRouter } from 'next/router'
// import ComparisonDashboard from '@/components/ComparisonDashboard'

// export default function EmbedPage() {
//   const router = useRouter()
//   const { countries } = router.query
//   const list = typeof countries === 'string' ? countries.split(',') : []

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
//       <ComparisonDashboard countries={list} apiUrl="/api/news" />
//     </div>
//   )
// }

// // Embeddable snippet (to include in external page):
// // <iframe src="https://yourdomain.com/embed/us,th,jp" width="600" height="400" frameBorder="0" />
