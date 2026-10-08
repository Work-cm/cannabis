"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { FiShoppingBag, FiArrowRight, FiChevronDown } from "react-icons/fi";
import CannabisIcon from "@/components/CannabisIcon";
import Logo from "@/components/Logo";
import { STRAINS, FLOWER_ORDER } from "@/lib/categories";

const flowers = FLOWER_ORDER.map((key) => ({
  href: `/shop?strain=${key}`,
  label: STRAINS[key].label,
  desc: STRAINS[key].tagline,
}));

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { label: "Flowers", children: flowers },
  { href: "/shop?strain=etomidate", label: "Etomidate Kpods" },
  { href: "/shop?strain=preroll", label: "Preroll" },
  { href: "/about", label: "Our Story" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href) => {
    const base = href.split("?")[0];
    if (base === "/") return pathname === "/";
    return pathname === base && !href.includes("?");
  };

  return (
    <header className="relative z-50 pointer-events-none">
      <nav
        className={`sticky top-4 z-50 mx-4 sm:mx-6 lg:mx-auto lg:max-w-6xl mt-4 rounded-full border pointer-events-auto transition-all duration-300 ${
          scrolled
            ? "bg-cream/80 backdrop-blur-2xl border-sand shadow-[0_16px_50px_-18px_rgba(163,71,13,0.35)]"
            : "bg-cream/95 backdrop-blur-md border-sand/60 shadow-[0_12px_40px_-16px_rgba(163,71,13,0.25)]"
        }`}
      >
        <div className="flex items-center justify-between h-14 px-2 pr-3 pl-3">
          {/* Logo mark */}
          <Link href="/" className="flex items-center pl-1" aria-label="CannabisLap home">
            <Logo className="h-8 sm:h-9 w-auto" />
          </Link>

          {/* Desktop links with sliding pill */}
          <div className="hidden xl:flex items-center gap-1 relative">
            {links.map((l) =>
              l.children ? (
                <div key={l.label} className="relative group">
                  <button className="relative flex items-center gap-1 px-4 py-2 text-[13px] font-medium tracking-wide text-bark/80 hover:text-forest transition-colors">
                    {l.label}
                    <FiChevronDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:rotate-180" />
                  </button>
                  <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 opacity-0 invisible translate-y-1 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200">
                    <div className="w-60 rounded-2xl bg-cream/95 backdrop-blur-xl border border-sand shadow-[0_24px_50px_-20px_rgba(163,71,13,0.35)] p-2">
                      {l.children.map((c) => (
                        <Link
                          key={c.href}
                          href={c.href}
                          className="group/item flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-sand/50 transition-colors"
                        >
                          <span className="w-8 h-8 shrink-0 rounded-full bg-sand text-moss flex items-center justify-center transition-colors group-hover/item:bg-forest group-hover/item:text-gold-soft">
                            <CannabisIcon className="w-4 h-4" stem={false} />
                          </span>
                          <span className="min-w-0">
                            <span className="block text-sm font-semibold text-forest">{c.label}</span>
                            <span className="block text-[11px] text-bark/60">{c.desc}</span>
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`relative px-4 py-2 text-[13px] font-medium tracking-wide transition-colors ${
                    isActive(l.href) ? "text-forest" : "text-bark/80 hover:text-forest"
                  }`}
                >
                  {isActive(l.href) && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-full bg-sand -z-10"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                  {l.label}
                </Link>
              )
            )}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-2 rounded-full bg-forest text-cream text-sm font-semibold pl-4 pr-3 py-2.5 hover:bg-moss transition-colors group"
            >
              <FiShoppingBag className="w-4 h-4" />
              <span className="hidden md:inline">Shop</span>
              <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </Link>

            <button
              onClick={() => setOpen(!open)}
              className="xl:hidden w-9 h-9 rounded-full bg-paper border border-sand flex items-center justify-center text-forest hover:border-gold transition-colors"
              aria-label="Toggle menu"
            >
              {open ? <HiX className="w-4 h-4" /> : <HiOutlineMenuAlt3 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Floating mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.96 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="xl:hidden fixed top-[88px] left-4 right-4 z-50 rounded-[28px] bg-cream/95 backdrop-blur-xl border border-sand shadow-[0_24px_60px_-20px_rgba(163,71,13,0.35)] p-6 pointer-events-auto"
          >
            <ul className="divide-y divide-sand">
              {links.map((l, i) => (
                <motion.li
                  key={l.href || l.label}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.04 }}
                >
                  {l.children ? (
                    <div className="py-3">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-bark/50">{l.label}</p>
                      <ul>
                        {l.children.map((c) => (
                          <li key={c.href}>
                            <Link
                              href={c.href}
                              onClick={() => setOpen(false)}
                              className="flex items-center justify-between py-2.5 pl-4 font-display text-lg text-forest"
                            >
                              {c.label}
                              <FiArrowRight className="w-4 h-4 text-gold" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <Link
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-3.5 font-display text-xl text-forest"
                    >
                      {l.label}
                      <FiArrowRight className="w-4 h-4 text-gold" />
                    </Link>
                  )}
                </motion.li>
              ))}
            </ul>
            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="mt-6 flex items-center justify-center gap-2 bg-gradient-to-r from-gold to-moss text-cream font-semibold py-3.5 rounded-full"
            >
              <FiShoppingBag className="w-4 h-4" />
              Shop the Harvest
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

