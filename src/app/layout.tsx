import type { Metadata, Viewport } from "next";
import "./globals.css";

const BASE_URL = "https://5onam.vercel.app";

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111827" },
  ],
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: "5onam AI Agent",
    template: "%s | 5onam AI A",
  },
  description:
    "5onam AI is an advanced intelligent workspace agent for instant code generation, full-context reasoning, data analysis, and high-speed dynamic AI image generation.",
  applicationName: "5onam AI",
  authors: [{ name: "Zen-Tech", url: BASE_URL }],
  generator: "Next.js",
  keywords: [
    "5onam AI",
    "AI Agent",
    "ZenTech OS",
    "Autonomous AI",
    "AI Image Generator",
    "Coding Assistant",
    "Developer Tools",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Zen-Tech",
  publisher: "Zen-Tech",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "5onam AI | Next-Gen Intelligence Agent",
    description:
      "Interact with 5onam AI for real-time coding, contextual memory, and high-resolution dynamic image generation.",
    url: BASE_URL,
    siteName: "5onam AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "5onam AI Agent Interface Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "5onam AI | Autonomous AI Agent & Workspace",
    description:
      "Fast, contextual AI workflows with built-in code analysis and instant image generation.",
    images: ["/og-image.png"],
    creator: "@zentech",
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/favicon.ico" }, { url: "/icon.png", type: "image/png" }],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
};

// Structured Schema Markup (Schema.org JSON-LD)
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "5onam AI",
  url: BASE_URL,
  description:
    "An AI intelligence workspace supporting conversational assistance, codebase debugging, custom memory banks, and instant graphic generation.",
  applicationCategory: "BusinessApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  creator: {
    "@type": "Organization",
    name: "Zen-Tech",
    url: BASE_URL,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
