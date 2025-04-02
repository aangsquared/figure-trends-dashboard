import dbConnect from "../../../lib/dbConnect"
import Figure from "../../../models/Figure"

export default async function handler(req, res) {
  await dbConnect()

  if (req.method === "GET") {
    try {
      const figures = await Figure.find({}).sort({ createdAt: -1 }).limit(50)

      res.status(200).json({ success: true, data: figures })
    } catch (error) {
      res.status(500).json({ success: false, message: error.message })
    }
  } else {
    res.status(405).json({ success: false, message: "Method not allowed" })
  }
}
