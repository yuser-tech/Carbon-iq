import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GreenPulse AI | Carbon Footprint Awareness",
  description: "Understand, track, and reduce your carbon footprint with AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased selection:bg-emerald/30`}>
        <main className="relative min-h-screen">
          {children}
          <Navbar />
        </main>
      </body>
    </html>
  );
}
