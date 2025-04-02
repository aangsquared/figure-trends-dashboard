import mongoose from "mongoose"

const FigureSchema = new mongoose.schema(
  {
    title: { type: String, required: true },
    manufacturer: { type: String },
    price: { type: String },
    releaseDate: { type: Date },
    preorderStatus: { type: String },
    url: { type: String, required: true },
    imageUrl: { type: String },
    source: { type: String, required: true }, // e.g., "sideshow", "amiami"
    popularity: { type: Number, default: 0 },
    availabilityStatus: { type: String },
    lastChecked: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Compound index to avoid duplicates
FigureSchema.index({ url: 1, source: 1 }, { unique: true })

export default mongoose.models.Figure || mongoose.model("Figure", FigureSchema)
