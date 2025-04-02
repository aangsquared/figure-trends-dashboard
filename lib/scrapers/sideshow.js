import puppeteer from "puppeteer"
import cheerio from "cheerio"

export async function scrapeSideshow() {
  console.log("Starting Sideshow scraper...")
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  })

  try {
    const page = await browser.newPage()
    // Set user agent to avoid being blocked
    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
    )

    await page.goto("https://www.sideshow.com/manufacturers/hot-toys", {
      waitUntil: "networkidle2",
    })

    const content = await page.content()
    const $ = cheerio.load(content)

    const figures = []

    $(".product-item").each((i, el) => {
      figures.push({
        title: $(el).find(".product-item-name").text().trim(),
        price: $(el).find(".price").text().trim(),
        preorderStatus: $(el).find(".availability").text().trim(),
        url: $(el).find("a").attr("href"),
        imageUrl: $(el).find("img").attr("src"),
        source: "sideshow",
        lastChecked: new Date(),
      })
    })

    return figures
  } catch (error) {
    console.error("Sideshow scraper error:", error)
    return []
  } finally {
    await browser.close()
  }
}
