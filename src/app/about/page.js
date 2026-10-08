import dbConnect from "@/lib/mongodb";
import Settings from "@/models/Settings";
import AboutClient from "@/components/AboutClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "About CannabisLap — Trusted Cannabis Dispensary Since 2019 | CannabisLap.com",
  description:
    "CannabisLap.com has been a trusted name in premium cannabis since 2019. Learn about our craft growers, rigorous lab testing, and commitment to top-shelf quality with every product.",
  keywords: [
    "trusted cannabis supplier",
    "reliable weed vendor",
    "best online dispensary",
    "cannabis dispensary since 2019",
    "premium cannabis supplier",
    "lab tested weed",
    "cannabis quality standards",
    "trusted online weed shop",
    "discreet cannabis supplier",
    "weed worldwide shipping",
    "about CannabisLap",
    "cannabislap.com review",
  ],
  openGraph: {
    title: "About CannabisLap — Quality & Trust Since 2019",
    description:
      "Craft-grown cannabis, lab-tested quality, discreet shipping with every order. Learn why customers worldwide trust CannabisLap.com.",
    url: "https://cannabislap.com/about",
  },
  alternates: {
    canonical: "https://cannabislap.com/about",
  },
};

export default async function AboutPage() {
  await dbConnect();
  let siteSettings = await Settings.findOne({ key: "main" }).lean();
  if (!siteSettings) {
    siteSettings = { aboutText: "" };
  }

  return <AboutClient aboutText={siteSettings.aboutText || ""} />;
}


