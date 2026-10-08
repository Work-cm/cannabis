import "dotenv/config";
import { readFileSync } from "node:fs";
import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;
const strain = (process.argv[2] || "").toLowerCase();

if (!["indica", "sativa", "hybrid", "etomidate", "preroll"].includes(strain)) {
  console.error("Usage: node scripts/seed-strain.mjs <indica|sativa|hybrid|etomidate|preroll>");
  process.exit(1);
}

if (!MONGODB_URI || /<[^>]+>/.test(MONGODB_URI)) {
  console.error("MONGODB_URI is missing or still a placeholder in .env — add your real MongoDB connection string first.");
  process.exit(1);
}

const SizeSchema = new mongoose.Schema({ label: String, price: Number }, { _id: false });

const ProductSchema = new mongoose.Schema(
  {
    slug: { type: String, unique: true },
    name: String,
    price: Number,
    category: String,
    strainType: String,
    grade: String,
    shortDescription: String,
    description: String,
    specifications: [String],
    sizes: [SizeSchema],
    inStock: { type: Boolean, default: true },
    image: String,
  },
  { timestamps: true }
);

const Product = mongoose.models.Product || mongoose.model("Product", ProductSchema);

const products = JSON.parse(readFileSync(new URL(`./data/${strain}-products.json`, import.meta.url), "utf8"));

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);

  const ops = products.map((p) => ({
    updateOne: {
      filter: { slug: p.slug },
      update: { $set: { ...p, strainType: strain } },
      upsert: true,
    },
  }));

  const res = await Product.bulkWrite(ops);
  console.log(`${strain} products: ${res.upsertedCount} added, ${res.modifiedCount} updated (${products.length} total).`);

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});
