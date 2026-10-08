import CannabisIcon from "@/components/CannabisIcon";

// CannabisLap sells cannabis flower only — "powder" is the internal DB key for flower.
export const CATEGORY_ORDER = ["powder"];

export const CATEGORIES = {
  powder: {
    label: "Flower",
    long: "Cannabis Flower",
    tagline: "Hand-trimmed, slow-cured buds",
    description: "Top-shelf indica, sativa & hybrid strains — hand-trimmed, slow-cured and jarred at peak freshness.",
    tint: "bg-[#fbe3c8]",
  },
};

export function categoryLabel(category) {
  return CATEGORIES[category]?.label || "Flower";
}

export function CategoryIcon({ className = "w-6 h-6" }) {
  return <CannabisIcon className={className} />;
}

// Product groups used for shop filtering (?strain=indica|sativa|hybrid|etomidate|preroll)
export const STRAIN_ORDER = ["indica", "sativa", "hybrid", "etomidate", "preroll"];

// Subset shown inside the navbar "Flowers" dropdown
export const FLOWER_ORDER = ["indica", "sativa", "hybrid"];

export const STRAINS = {
  indica: {
    label: "Indica",
    long: "Indica Strains",
    tagline: "Unwind & rest",
    description: "Heavy, body-melting calm. The classic end-of-day strains for couch nights, deep sleep and letting go.",
    tint: "bg-[#fbd8b4]",
  },
  sativa: {
    label: "Sativa",
    long: "Sativa Strains",
    tagline: "Lift & create",
    description: "Bright, energetic and cerebral. Perfect for daytime adventures, creative sessions and good conversation.",
    tint: "bg-[#fbe3c8]",
  },
  hybrid: {
    label: "Hybrid",
    long: "Hybrid Strains",
    tagline: "Best of both",
    description: "Balanced blends that bring calm and clarity together. Our most-loved strains live right here.",
    tint: "bg-[#fdf0de]",
  },
  etomidate: {
    label: "Etomidate Kpods",
    long: "Etomidate Kpods",
    tagline: "Smooth & discreet",
    description: "Lab-tested etomidate vape pods — consistent hits, clean hardware and flavour that lasts to the last puff.",
    tint: "bg-[#ffe4cc]",
  },
  preroll: {
    label: "Preroll",
    long: "Prerolls",
    tagline: "Rolled & ready",
    description: "Hand-packed prerolls from the same top-shelf flower — evenly ground, slow-burning and ready to light.",
    tint: "bg-[#f7d9b8]",
  },
};

export function normalizeStrain(value) {
  const v = (value || "").toString().toLowerCase();
  // Check product forms first so e.g. "Preroll — Indica" lands in preroll.
  if (v.includes("etomidate") || v.includes("kpod")) return "etomidate";
  if (v.includes("preroll") || v.includes("pre-roll") || v.includes("pre roll")) return "preroll";
  if (v.includes("indica")) return "indica";
  if (v.includes("sativa")) return "sativa";
  if (v.includes("hybrid")) return "hybrid";
  return "";
}

export function strainLabel(value) {
  return STRAINS[normalizeStrain(value)]?.label || "";
}

export function startingPrice(product) {
  const prices = (product.sizes || []).map((s) => s.price).filter((p) => typeof p === "number");
  if (prices.length) return Math.min(...prices);
  return product.price || 0;
}
