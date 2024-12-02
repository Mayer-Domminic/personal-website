import type { Metadata } from "next";
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import "./globals.css";

export const metadata: Metadata = {
  title: "domm.dev | Jr. Software Engineer",
  description: "Portfolio of Domminic Mayer",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} antialiased bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 min-h-screen`}
      >
        {children}
      </body>
    </html>
  );
}