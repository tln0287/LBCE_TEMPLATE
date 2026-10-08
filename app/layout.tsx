import type { Metadata, Viewport } from "next";
import { Inter, Manrope } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { MobileCTA } from "@/components/layout/MobileCTA";
import { CommandPalette } from "@/components/layout/CommandPalette";
import { RevealObserver } from "@/components/ui/RevealObserver";
import { JsonLd } from "@/components/ui/JsonLd";
import { departments, mainNav, site } from "@/lib/content";
import { organizationSchema, websiteSchema } from "@/lib/seo";

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/components.css";
import "./styles/chrome.css";
import "./styles/home.css";
import "./styles/home-hero.css";
import "./styles/pages.css";
import "./styles/pages-academic.css";
import "./styles/pages-campus.css";
import "./styles/pages-institution.css";
import "./styles/pages-forms.css";
import "./styles/pages-placements.css";
import "./styles/pages-committees.css";
import "./styles/search.css";
import "./styles/tone.css";
import "./styles/motion.css";

const manrope = Manrope({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-manrope", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Visakhapatnam`, template: `%s | ${site.shortName}` },
  description: `${site.name}, Visakhapatnam. ${site.affiliation}. Engineering programs in CSE, Civil, ECE, EEE and Mechanical.`,
  applicationName: site.shortName,
};

export const viewport: Viewport = {
  themeColor: "#071A2B",
  width: "device-width",
  initialScale: 1,
};

const SHORT: Record<string, string> = { MECH: "Mechanical", CIVIL: "Civil" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const deptLite = departments.map((d) => ({
    slug: d.slug,
    code: d.code,
    name: d.name,
    summary: d.summary,
    icon: d.icon,
    short: SHORT[d.code] ?? d.code,
  }));
  return (
    <html lang="en-IN" className={`${manrope.variable} ${inter.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Header
          nav={mainNav}
          departments={deptLite}
          utility={site.utility.left}
          brand={{ name: site.name, tagline: site.tagline }}
          contact={{ phone: site.contact.phone, email: site.contact.email }}
          applyHref="/admissions#apply"
        />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <MobileCTA />
        <CommandPalette />
        <RevealObserver />
        <JsonLd data={[organizationSchema(), websiteSchema()]} />
      </body>
    </html>
  );
}
