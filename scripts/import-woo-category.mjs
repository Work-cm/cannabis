// Usage: node scripts/import-woo-category.mjs <siteUrl> <wooCategorySlug> <strainKey>
// Example: node scripts/import-woo-category.mjs https://goodnewscannabisofficial.com preroll preroll
import { mkdirSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const [siteArg, categorySlug, strainKey] = process.argv.slice(2);
if (!siteArg || !categorySlug || !strainKey) {
  console.error("Usage: node scripts/import-woo-category.mjs <siteUrl> <wooCategorySlug> <strainKey>");
  process.exit(1);
}

const site = siteArg.replace(/\/+$/, "");
const headers = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36",
  Accept: "application/json",
};
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const imageDir = path.join(root, "public", "uploads", strainKey);
const dataFile = path.join(root, "scripts", "data", `${strainKey}-products.json`);

const entities = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " ", ndash: "–", mdash: "—", hellip: "…", rsquo: "’", lsquo: "‘", rdquo: "”", ldquo: "“" };

function decode(str = "") {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&([a-z]+);/gi, (m, n) => entities[n.toLowerCase()] ?? m);
}

function htmlToText(html = "") {
  const text = html
    .replace(/<\s*br\s*\/?>/gi, "\n")
    .replace(/<\/(p|h[1-6]|li|div|tr)>/gi, "\n")
    .replace(/<li[^>]*>/gi, "• ")
    .replace(/<[^>]+>/g, "");
  return decode(text)
    .split("\n")
    .map((l) => l.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n\n");
}

async function getJson(url) {
  const res = await fetch(url, { headers });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} — ${url}`);
  return res.json();
}

function toPrice(prices) {
  const minor = Number(prices?.currency_minor_unit ?? 2);
  return Number(prices?.price ?? 0) / 10 ** minor;
}

async function downloadImage(src) {
  if (!src) return "";
  mkdirSync(imageDir, { recursive: true });
  const file = decodeURIComponent(new URL(src).pathname.split("/").pop());
  const dest = path.join(imageDir, file);
  if (!existsSync(dest)) {
    const res = await fetch(src, { headers: { "User-Agent": headers["User-Agent"] } });
    if (!res.ok) throw new Error(`Image ${res.status} — ${src}`);
    writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
  }
  return `/uploads/${strainKey}/${file}`;
}

async function main() {
  const cats = await getJson(`${site}/wp-json/wc/store/v1/products/categories?per_page=100`);
  const cat = cats.find((c) => c.slug === categorySlug);
  if (!cat) throw new Error(`Category "${categorySlug}" not found on ${site}`);

  const items = await getJson(`${site}/wp-json/wc/store/v1/products?category=${cat.id}&per_page=100`);
  console.log(`Found ${items.length} products in "${cat.name}".`);

  const products = [];
  for (const p of items) {
    const name = decode(p.name).replace(/\s+/g, " ").trim();
    const description = htmlToText(p.description);

    let sizes = [];
    for (const v of p.variations || []) {
      const vd = await getJson(`${site}/wp-json/wc/store/v1/products/${v.id}`);
      const label = (v.attributes || []).map((a) => decode(a.value)).join(" / ") || decode(vd.name);
      sizes.push({ label: label.replace(/\b\w/g, (c) => c.toUpperCase()), price: toPrice(vd.prices) });
    }
    sizes = sizes.filter((s) => s.price > 0).sort((a, b) => a.price - b.price);

    const thc = description.match(/THC:\s*[\d.]+\s*%/i)?.[0];
    const type = description.match(/\b(Indica|Sativa|Hybrid)\b/i)?.[1];
    const brand = name.split(/\s+[–-]\s+/)[0];
    const specifications = [
      `Category: ${cat.name}`,
      brand && brand !== name ? `Brand: ${brand}` : null,
      type ? `Type: ${type[0].toUpperCase()}${type.slice(1).toLowerCase()}` : null,
      thc ? thc.replace(/\s+/g, " ") : null,
    ].filter(Boolean);

    products.push({
      slug: p.slug,
      name,
      price: sizes[0]?.price ?? toPrice(p.prices),
      category: "powder",
      strainType: strainKey,
      grade: "",
      shortDescription: htmlToText(p.short_description).split("\n\n")[0] || "",
      description,
      specifications,
      sizes,
      inStock: Boolean(p.is_in_stock),
      image: await downloadImage(p.images?.[0]?.src),
    });
    console.log(`  ✓ ${name} — ${sizes.map((s) => `${s.label} $${s.price}`).join(", ")}`);
  }

  mkdirSync(path.dirname(dataFile), { recursive: true });
  writeFileSync(dataFile, JSON.stringify(products, null, 2));
  console.log(`Saved ${products.length} products to ${path.relative(root, dataFile)}`);
}

main().catch((err) => {
  console.error("Import error:", err.message);
  process.exit(1);
});
