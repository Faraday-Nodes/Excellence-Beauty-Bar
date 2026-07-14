import type { Metadata } from "next";
import "./globals.css";
import { WaxTransitionProvider } from "@/components/wax-transition";
import { SalonNavBar } from "@/components/salon-navbar";

export const metadata: Metadata = {
  title: "Excellence Beauty Bar | Where beauty meets excellence",
  description:
    "Excellence Beauty Bar is a private waxing, skincare, lash and makeup studio in Saddle Brook, New Jersey. Book online.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          precedence="default"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,500;0,600;0,700;1,600&family=Great+Vibes&display=swap"
        />
        <WaxTransitionProvider>
          <SalonNavBar />
          {children}
        </WaxTransitionProvider>
      </body>
    </html>
  );
}
