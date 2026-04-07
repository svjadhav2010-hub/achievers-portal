import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import "./globals.css";
import { ThemeProvider, ThemeScript } from "./components/ThemeProvider";

const dmSans = DM_Sans({
  subsets: ["latin"],
  axes: ["opsz"],
  weight: "variable",
  style: ["normal", "italic"],
  variable: "--font-dm-sans",
  display: "swap",
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-dm-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "The Achievers Club · Nashik Branch",
  description:
    "A premium digital community where young entrepreneurs in Nashik learn, network, and generate passive income. Join the Achievers Club today.",
  keywords: [
    "Achievers Club", "Nashik", "digital entrepreneurship",
    "passive income", "Forever Living Products", "FLP Nashik",
    "network marketing Nashik",
  ],
  openGraph: {
    title: "The Achievers Club · Nashik Branch",
    description: "Build wealth on your terms. Join 500+ digital entrepreneurs in Nashik's fastest-growing business community.",
    type: "website",
    locale: "en_IN",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}