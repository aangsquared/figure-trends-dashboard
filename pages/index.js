import { useState, useEffect } from "react"
import Head from "next/head"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [figures, setFigures] = useState([])

  useEffect(() => {
    async function fetchFigures() {
      try {
        const response = await fetch("/api/figures")
        const data = await response.json()

        if (data.success) {
          setFigures(data.data)
        }
      } catch (error) {
        console.error("Error fetching figures:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchFigures()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>Figure Collection Tracker</title>
      </Head>

      <header className="mb-8">
        <h1 className="text-3xl font-bold">Figure Collection Tracker</h1>
      </header>

      {loading ? (
        <p>Loading figures...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {figures.map((figure) => (
            <div key={figure._id} className="border rounded-lg p-4 shadow-sm">
              {figure.imageUrl && (
                <div className="mb-4">
                  <img
                    src={figure.imageUrl}
                    alt={figure.title}
                    className="w-full h-48 object-contain"
                  />
                </div>
              )}
              <h2 className="text-lg font-bold">{figure.title}</h2>
              <p className="text-gray-700">{figure.price}</p>
              <p className="text-sm text-gray-500">
                Status: {figure.preorderStatus}
              </p>
              <div className="mt-2">
                <a
                  href={figure.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View on {figure.source}
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
