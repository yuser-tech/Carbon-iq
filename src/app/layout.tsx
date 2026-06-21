import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { AppProvider } from "@/components/ui/AppProvider";

const inter = Inter({ subsets: ["latin"], display: "swap" });

/**
 * Root Layout Component
 * Wraps the entire application with providers and global configuration
 */
export const metadata: Metadata = {
  title: {
    default: "CarbonIQ AI | Carbon Footprint Intelligence",
    template: "%s | CarbonIQ AI",
  },
  description: "Understand, track, and reduce your carbon footprint with AI-powered insights and personalized recommendations.",
  keywords: [
    "carbon footprint",
    "carbon tracking",
    "sustainability",
    "climate change",
    "eco-friendly",
    "carbon reduction",
    "environmental impact",
    "green living",
    "emissions calculator",
    "carbon neutral",
  ],
  authors: [{ name: "CarbonIQ AI Team" }],
  creator: "CarbonIQ AI",
  publisher: "CarbonIQ AI",
  metadataBase: new URL("https://carboniq.ai"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://carboniq.ai",
    siteName: "CarbonIQ AI",
    title: "CarbonIQ AI | Carbon Footprint Intelligence",
    description: "Understand, track, and reduce your carbon footprint with AI-powered insights.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "CarbonIQ AI - Track Your Impact, Heal the Planet",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "CarbonIQ AI | Carbon Footprint Intelligence",
    description: "Understand, track, and reduce your carbon footprint with AI-powered insights.",
    images: ["/og-image.png"],
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
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.json",
};

/**
 * Viewport configuration for responsive design
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#1B5E20" },
    { media: "(prefers-color-scheme: dark)", color: "#081C15" },
  ],
};

/**
 * Root Layout Component
 * Provides the main document structure with providers
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AppProvider>
          <main id="main-content" className="relative min-h-screen" role="main">
            {children}
            <Navbar />
          </main>
        </AppProvider>
      </body>
    </html>
  );
}
