import type { Metadata } from "next";
import "./globals.css";
import { AppProviders } from "@/components/providers/app-providers";

export const metadata: Metadata = {
  title: {
    template: "%s | TamaSave",
    default: "TamaSave - Gamified Web3 Savings with Ritual Network",
  },
  description: "Turn your savings goals into living digital pets. TamaSave uses Ritual Scheduler to automate your deposits while you watch your virtual pet evolve on-chain.",
  keywords: ["web3 savings", "ritual network", "digital pets", "gamified finance", "crypto savings", "automated deposits", "tamagotchi web3"],
  authors: [{ name: "TamaSave Team" }],
  openGraph: {
    title: "TamaSave - Gamified Web3 Savings",
    description: "Feed your future! Automate your savings using Ritual Scheduler and grow your on-chain digital pet.",
    url: "https://tamasave.com",
    siteName: "TamaSave",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "TamaSave Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TamaSave - Gamified Web3 Savings",
    description: "Feed your future! Automate your savings using Ritual Scheduler and grow your on-chain digital pet.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/logo home/TamaSave.png",
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen font-sans">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
