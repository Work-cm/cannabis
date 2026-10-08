import { Poppins } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ToastProvider from "@/components/ToastProvider";
import SocialFloat from "@/components/SocialFloat";
import ImageProtection from "@/components/ImageProtection";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal"],
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://cannabislap.com"),
  title: {
    default: "CannabisLap — Premium Cannabis Flower | CannabisLap.com",
    template: "%s | CannabisLap.com",
  },
  description:
    "CannabisLap.com — Premium cannabis flower. Indica, sativa & hybrid strains, independently lab tested and shipped discreetly worldwide.",
  keywords: [
    "buy weed online",
    "cannabis for sale",
    "order cannabis online",
    "weed shop",
    "cannabis store",
    "buy cannabis flower",
    "premium cannabis flower",
    "weed flower for sale",
    "indica flower",
    "sativa flower",
    "hybrid strains",
    "AAAA weed",
    "craft cannabis",
    "lab tested cannabis",
    "premium cannabis",
    "top shelf weed",
    "discreet weed shipping",
    "cannabis worldwide delivery",
    "weed bulk order",
    "cannabis wholesale",
    "buy marijuana online",
    "marijuana for sale",
    "mail order marijuana",
    "online dispensary",
    "cannabis dispensary online",
    "CannabisLap",
    "cannabislap.com",
    "weed strains",
    "high THC flower",
    "organic cannabis",
    "cannabis delivery",
    "420 shop",
    "buy bud online",
  ],
  authors: [{ name: "CannabisLap.com" }],
  creator: "CannabisLap.com",
  publisher: "CannabisLap.com",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://cannabislap.com",
    siteName: "CannabisLap.com",
    title: "CannabisLap — Premium Cannabis Flower",
    description:
      "CannabisLap.com — Premium cannabis flower. Indica, sativa & hybrid strains, independently lab tested and shipped discreetly worldwide.",
  },
  twitter: {
    card: "summary_large_image",
    title: "CannabisLap — Premium Cannabis Flower",
    description:
      "CannabisLap.com — Premium cannabis flower. Indica, sativa & hybrid strains, lab tested and shipped discreetly worldwide.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://cannabislap.com",
  },
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${poppins.variable} h-full antialiased`}
    >
      <head></head>
      <body className="min-h-full flex flex-col bg-cream text-ink font-sans">
        <ImageProtection />
        <ToastProvider />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <SocialFloat />
        <Script id="tawk-to" strategy="afterInteractive">{`
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/6ac8016c9d3e4a34c362bac6/1k4ekb628';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
`}</Script>
      </body>
    </html>
  );
}
