import { readFileSync, writeFileSync } from "node:fs";

// Rebuild sizes for indica/sativa/hybrid products:
// min = Half Pound, then 1 / 1.5 / 2 / 2.5 / 3 / 3.5 / 4 / 4.5 / 5 Pounds.
// Prices follow the existing bulk-discount curve (doubling quantity ≈ x1.85,
// i.e. price = poundBase * lb^0.855), rounded to the nearest $5.

const STRAINS = ["indica", "sativa", "hybrid"];
const WEIGHTS = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5];
const CURVE = 0.855; // fitted from existing Half Pound -> Pound ratio (~1.85)

// Fallback multipliers to infer a pound price when a product has no Pound size.
// Derived from the observed step ratios across the catalog.
const TO_POUND = {
  "half pound": 1.85,
  "quarter pound": 3.4,
  "1 ounce": 8.63,
  "1/2 ounce": 16.9,
  "7 grams": 31.6,
};

const labelFor = (w) => (w === 0.5 ? "Half Pound" : w === 1 ? "1 Pound" : `${w} Pounds`);
const round5 = (n) => Math.round(n / 5) * 5;

function poundBase(p) {
  const sizes = p.sizes || [];
  const pound = sizes.find((s) => /^pound$/i.test(s.label.trim()));
  if (pound) return pound.price;

  // Use the largest known size available.
  for (const key of ["half pound", "quarter pound", "1 ounce", "1/2 ounce", "7 grams"]) {
    const hit = sizes.find((s) => s.label.trim().toLowerCase() === key);
    if (hit) return hit.price * TO_POUND[key];
  }

  // No usable sizes — fall back to the product's base (7g) price.
  return (p.price || 25) * TO_POUND["7 grams"];
}

for (const strain of STRAINS) {
  const file = new URL(`./data/${strain}-products.json`, import.meta.url);
  const products = JSON.parse(readFileSync(file, "utf8"));

  for (const p of products) {
    const base = poundBase(p);
    p.sizes = WEIGHTS.map((w) => ({ label: labelFor(w), price: round5(base * Math.pow(w, CURVE)) }));
    p.price = p.sizes[0].price;
  }

  writeFileSync(file, JSON.stringify(products, null, 2) + "\n");
  const sample = products[0];
  console.log(`${strain}: ${products.length} products updated — e.g. ${sample.name}: ${sample.sizes.map((s) => `${s.label}=$${s.price}`).join(", ")}`);
}
