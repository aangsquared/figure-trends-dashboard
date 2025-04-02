import dbConnect from "../../lib/dbConnect"
import Figure from "../../models/Figure"
import { scrapeSideshow } from "../../lib/scrapers/sideshow"

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" })
  }

  // Check for a secret token to prevent unauthorized access
  const { token } = req.body

  if (token !== process.env.API_SECRET_TOKEN) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  try {
    await dbConnect()

    // Run scraper
    const figures = await scrapeSideshow()
    console.log(`Found ${figures.length} figures from Sideshow`)

    // Save to database
    let created = 0
    let updated = 0

    for (const figure of figures) {
      // Try to find existing figure by URL
      const existingFigure = await Figure.findOne({
        url: figure.url,
        source: figure.source,
      })

      if (existingFigure) {
        // Update existing figure
        await Figure.updateOne(
          { _id: existingFigure._id },
          {
            ...figure,
            lastChecked: new Date(),
          }
        )
        updated++
      } else {
        // Create new figure
        await Figure.create(figure)
        created++
      }
    }

    res.status(200).json({
      success: true,
      message: `Scraped ${figures.length} figures. Created: ${created}, Updated: ${updated}`,
    })
  } catch (error) {
    console.error("Scrape handler error:", error)
    res.status(500).json({ success: false, message: error.message })
  }
}
