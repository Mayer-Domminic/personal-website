import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { Navigation } from "@/components/Navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "domm.dev | Software Engineer",
  description: "Portfolio of Domminic Mayer - Software Engineer focused on AI/ML and innovative solutions",
  keywords: "domm.dev, domm, software engineer, AI, ML, web development, React, Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900`}>
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}