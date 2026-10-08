"use client";
import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiMessageCircle, FiChevronDown, FiShield } from "react-icons/fi";
import ProductCard from "@/components/ProductCard";
import ProtectedImage from "@/components/ProtectedImage";
import { STRAINS, STRAIN_ORDER, normalizeStrain, startingPrice } from "@/lib/categories";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
};

const steps = [
  { title: "Grown with care", text: "Sourced from small craft growers using living soil and slow, patient cures." },
  { title: "Tested in the lab", text: "Every batch is checked for potency, pesticides, moulds and heavy metals." },
  { title: "Sealed for freshness", text: "Vacuum-sealed, smell-proof and packed in plain, unbranded boxes." },
  { title: "At your door", text: "Sent with tracking, discreetly and reliably — wherever you are." },
];

const reviews = [
  {
    name: "Elena K.",
    place: "Berlin",
    text: "Five years of consistent quality. Their flower has become my gold standard — always fresh, sticky and exactly as described.",
  },
  {
    name: "James M.",
    place: "Amsterdam",
    text: "The AAAA craft strains are a game changer. Real flavour, proper cure, and the discreet shipping means zero hassle. Best shop I've used.",
  },
  {
    name: "Yuki T.",
    place: "Lisbon",
    text: "Packaging is phenomenal. After two weeks in transit the buds arrived perfectly cured — still sticky, still loud.",
  },
];

const orbitPositions = [
  { top: "0%", left: "50%", transform: "translate(-50%, 0)" },
  { bottom: "12%", left: "6%", transform: "translate(0, 0)" },
  { bottom: "12%", right: "6%", transform: "translate(0, 0)" },
];

const fallbackImage = "/uploads/Chocolate-kush-strain.jpg";

export default function HomePage({ products = [], siteSettings = {} }) {
  const settings = siteSettings || {};
  const featured = products.find((p) => p.image && p.inStock) || products.find((p) => p.inStock) || products[0];
  const heroShots = products.filter((p) => p.image).slice(0, 3);
  const orbit = (heroShots.length ? heroShots : [0, 1, 2].map(() => ({ name: "Featured", image: fallbackImage, price: 0 }))).map((c) => ({
    name: c.name,
    img: c.image || fallbackImage,
    price: startingPrice(c),
  }));

  const counts = useMemo(() => {
    const c = {};
    products.forEach((p) => {
      const key = normalizeStrain(p.strainType || p.name);
      if (key) c[key] = (c[key] || 0) + 1;
    });
    return c;
  }, [products]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "CannabisLap.com",
    url: "https://cannabislap.com",
    description: "Premium small-batch cannabis flower — indica, sativa & hybrid strains.",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ─── Hero ─── */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-forest-deep text-cream">
        {/* animated mesh backdrop */}
        <div className="absolute inset-0 opacity-60">
          <div className="absolute -top-1/4 -left-1/4 w-[70vw] h-[70vw] rounded-full bg-moss/40 blur-[120px] animate-pulse-slow" />
          <div className="absolute top-1/3 -right-1/4 w-[60vw] h-[60vw] rounded-full bg-clay/40 blur-[130px] animate-pulse-slower" />
          <div className="absolute -bottom-1/4 left-1/3 w-[55vw] h-[55vw] rounded-full bg-gold/20 blur-[110px] animate-pulse-slow" />
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#873a08_80%,#42220c_100%)]" />
        <div className="absolute inset-0 bg-forest-grain opacity-40" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 lg:py-0 grid lg:grid-cols-2 gap-12 items-center">
          {/* Copy */}
          <div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              className="inline-flex items-center gap-2 rounded-full border border-cream/20 bg-cream/5 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold-soft"
            >
              <span className="w-2 h-2 rounded-full bg-gold" />
              {settings.announcement || "CannabisLap.com · Small-batch · Lab-tested"}
            </motion.div>

            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={1}
              className="mt-8 font-display text-5xl sm:text-7xl lg:text-[100px] leading-[0.95] tracking-tight"
            >
              Cannabis,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-gold-soft to-moss">elevated.</span>
            </motion.h1>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={2}
              className="mt-6 max-w-lg text-lg leading-relaxed text-cream/70"
            >
              {settings.heroSubtitle ||
                "Hand-trimmed, slow-cured cannabis flower from growers who put the plant first — sealed fresh and shipped discreetly to your door."}
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              custom={3}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-moss px-8 py-4 text-cream font-semibold transition-all hover:brightness-105"
              >
                Shop the Harvest
                <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#strains"
                className="inline-flex items-center gap-2 rounded-full border border-cream/25 px-7 py-4 text-cream font-semibold hover:border-cream hover:bg-cream/5 transition-colors"
              >
                Find your vibe
                <FiChevronDown className="w-4 h-4" />
              </a>
            </motion.div>
          </div>

          {/* Orbital showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative hidden lg:flex items-center justify-center h-[560px]"
          >
            {/* orbit rings */}
            <div className="absolute w-[420px] h-[420px] rounded-full border border-cream/10" />
            <div className="absolute w-[340px] h-[340px] rounded-full border border-dashed border-gold/20" />
            <div className="absolute w-[260px] h-[260px] rounded-full border border-cream/5" />

            {/* center featured */}
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-gold/40 shadow-[0_0_80px_rgba(255,157,46,0.35)]">
              <ProtectedImage
                src={featured?.image || fallbackImage}
                alt={featured?.name || "Featured flower"}
                className="w-full h-full object-cover"
              />
            </div>

            {/* orbiting cards */}
            {orbit.map((c, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 + i * 0.15, ease: [0.22, 1, 0.36, 1] }}
                className={`absolute ${i === 0 ? "animate-float" : i === 1 ? "animate-float-delayed" : "animate-float-slow"}`}
                style={orbitPositions[i]}
              >
                <div className="w-36 rounded-2xl bg-paper p-2 pb-3 shadow-[0_20px_40px_-12px_rgba(0,0,0,0.55)]">
                  <ProtectedImage
                    src={c.img}
                    alt={c.name}
                    className="w-full h-28 object-cover rounded-xl"
                  />
                  <p className="mt-2 px-1 font-display text-xs text-forest truncate">{c.name}</p>
                  <p className="px-1 text-xs font-semibold text-moss">${c.price.toFixed(2)}</p>
                </div>
              </motion.div>
            ))}

            {/* floating lab seal */}
            <div className="absolute bottom-4 right-16 z-20 w-20 h-20 rounded-full bg-gradient-to-br from-gold to-moss text-forest-deep shadow-[0_12px_30px_-8px_rgba(255,157,46,0.6)] flex flex-col items-center justify-center text-center animate-float-delayed">
              <FiShield className="w-5 h-5" />
              <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.18em] leading-tight">
                Lab
                <br />
                Tested
              </span>
            </div>
          </motion.div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream/40">
          <span className="text-[10px] uppercase tracking-[0.22em]">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ─── Strain paths ─── */}
      <section id="strains" className="bg-paper scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            eyebrow="Find your path"
            title={
              <>
                Three ways to <em className="text-moss">feel</em> good
              </>
            }
            text="Indica, sativa and hybrid — each hand-picked, slow-cured and tested before it earns a spot on the menu."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-6">
            {STRAIN_ORDER.slice(0, 3).map((key, i) => {
              const strain = STRAINS[key];
              const count = counts[key] || 0;
              const accent = key === "indica" ? "bg-forest" : key === "sativa" ? "bg-gold" : "bg-moss";
              return (
                <motion.div
                  key={key}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                >
                  <Link
                    href={`/shop?strain=${key}`}
                    className="group block h-full rounded-[28px] bg-cream border border-sand p-8 hover:shadow-[0_24px_50px_-24px_rgba(163,71,13,0.25)] hover:border-gold/40 transition-all"
                  >
                    <div className={`h-1.5 w-14 rounded-full mb-8 ${accent}`} />
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/50">0{i + 1}</p>
                    <h3 className="mt-2 font-display text-3xl text-forest group-hover:text-moss transition-colors">{strain.long}</h3>
                    <p className="mt-4 text-sm leading-relaxed text-bark/70">{strain.description}</p>
                    <p className="mt-4 text-xs font-semibold uppercase tracking-[0.15em] text-clay">
                      {count > 0 ? `${count} product${count !== 1 ? "s" : ""} available` : "Coming soon"}
                    </p>
                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-forest">
                      Shop {strain.label}
                      <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── Featured products ─── */}
      <FeaturedProducts products={products} />

      {/* ─── Process timeline ─── */}
      <section className="bg-forest-deep text-cream overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            dark
            eyebrow="From seed to doorstep"
            title={
              <>
                Quality you can <em className="text-gold">trust</em>
              </>
            }
            text="Every order follows the same four-step promise. No shortcuts, no surprises."
          />

          <div className="mt-16 grid md:grid-cols-4 gap-10">
            {steps.map((s, i) => (
              <motion.div
                key={s.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-60px" }}
                custom={i}
                className="relative text-center"
              >
                <div className="mx-auto w-14 h-14 rounded-full bg-cream/10 border border-cream/20 flex items-center justify-center font-display text-xl text-cream">
                  {i + 1}
                </div>
                <h3 className="mt-6 font-display text-xl text-cream">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-cream/60 max-w-[240px] mx-auto">{s.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Reviews ─── */}
      <section className="bg-cream border-y border-sand">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <SectionHeading
            eyebrow="Straight from our customers"
            title={
              <>
                Real people. <em className="text-moss">Real reviews.</em>
              </>
            }
            text="Honest words from the people who order from us again and again."
          />

          <div className="mt-14 grid md:grid-cols-3 gap-6 items-stretch">
            {reviews.map((r, i) => {
              const highlight = i === 1;
              return (
                <motion.figure
                  key={r.name}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-60px" }}
                  custom={i}
                  className={`relative flex flex-col overflow-hidden rounded-3xl p-8 pt-10 transition-transform duration-300 ${
                    highlight
                      ? "bg-forest-deep text-cream md:-translate-y-4 shadow-[0_30px_60px_-30px_rgba(135,58,8,0.6)]"
                      : "bg-paper text-ink border border-sand hover:-translate-y-1 shadow-[0_20px_40px_-30px_rgba(163,71,13,0.35)]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`absolute -top-4 right-6 text-[120px] leading-none font-normal select-none ${
                      highlight ? "text-gold/25" : "text-gold/30"
                    }`}
                  >
                    &ldquo;
                  </span>

                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <FiStar key={s} className="w-4 h-4 text-gold fill-gold" />
                    ))}
                  </div>

                  <blockquote className={`relative mt-5 flex-1 text-base font-normal leading-relaxed ${highlight ? "text-cream/85" : "text-bark"}`}>
                    {r.text}
                  </blockquote>

                  <figcaption className={`mt-8 pt-6 flex items-center gap-3 border-t ${highlight ? "border-cream/15" : "border-sand"}`}>
                    <span className="w-11 h-11 rounded-full bg-gradient-to-br from-gold to-moss text-cream font-medium flex items-center justify-center">
                      {r.name.charAt(0)}
                    </span>
                    <span>
                      <span className={`block text-sm font-medium ${highlight ? "text-cream" : "text-forest"}`}>{r.name}</span>
                      <span className={`block text-xs font-normal ${highlight ? "text-cream/60" : "text-bark/60"}`}>
                        {r.place} · Verified buyer
                      </span>
                    </span>
                  </figcaption>
                </motion.figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── CTA ─── */}
      <section className="bg-paper py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[36px] bg-gradient-to-br from-gold via-moss to-clay px-8 py-16 sm:px-16 sm:py-20 shadow-[0_40px_80px_-40px_rgba(239,108,12,0.5)]">
            <div className="max-w-2xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-forest-deep">Talk to a budtender</span>
              <h2 className="mt-4 font-display text-4xl sm:text-5xl leading-tight text-forest-deep">
                Not sure where to start? We&apos;ll help you choose.
              </h2>
              <p className="mt-5 text-forest-deep/80 leading-relaxed">
                Real people, real cannabis knowledge. Tell us what you&apos;re looking for and we&apos;ll recommend the
                perfect strain, dose or product — usually within two hours.
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 rounded-full bg-forest-deep px-7 py-4 font-semibold text-cream hover:bg-forest transition-colors"
                >
                  <FiMessageCircle className="w-4 h-4" />
                  Ask our team
                </Link>
                <Link
                  href="/shop"
                  className="inline-flex items-center gap-2 rounded-full border-2 border-forest-deep/30 px-7 py-4 font-semibold text-forest-deep hover:border-forest-deep transition-colors"
                >
                  Browse the shop
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeading({ eyebrow, title, text, dark = false }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className="max-w-2xl mx-auto text-center"
    >
      <span className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] ${dark ? "text-gold" : "text-clay"}`}>
        <span className={`h-px w-6 ${dark ? "bg-gold/60" : "bg-clay/60"}`} />
        {eyebrow}
        <span className={`h-px w-6 ${dark ? "bg-gold/60" : "bg-clay/60"}`} />
      </span>
      <h2 className={`mt-4 font-display text-4xl sm:text-5xl leading-tight ${dark ? "text-cream" : "text-forest"}`}>{title}</h2>
      {text && <p className={`mt-5 leading-relaxed ${dark ? "text-cream/65" : "text-bark/70"}`}>{text}</p>}
    </motion.div>
  );
}

function FeaturedProducts({ products }) {
  const list = products.slice(0, 8);

  return (
    <section className="bg-cream border-y border-sand">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <SectionHeading
          eyebrow="Fresh from the jar"
          title={
            <>
              This week&apos;s <em className="text-moss">harvest</em>
            </>
          }
        />

        {list.length === 0 ? (
          <div className="mt-14 rounded-[28px] border border-dashed border-sand bg-paper px-8 py-20 text-center">
            <div className="mx-auto w-16 h-16 rounded-full border-2 border-dashed border-sand flex items-center justify-center text-forest/40 font-display text-2xl">?</div>
            <h3 className="mt-6 font-display text-3xl text-forest">The new harvest is curing</h3>
            <p className="mt-2 text-bark/70">Fresh products are landing very soon. Check back shortly.</p>
          </div>
        ) : (
          <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {list.map((product) => (
              <ProductCard key={product._id || product.slug} product={product} />
            ))}
          </div>
        )}

        <div className="mt-14 text-center">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 rounded-full border border-forest/25 px-7 py-4 font-semibold text-forest hover:bg-forest hover:text-cream hover:border-forest transition-colors"
          >
            View the full menu
            <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
