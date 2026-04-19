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
  metadataBase: new URL("https://achieversnashik.in"),
  title: {
    default: "Achievers Club Nashik — Start Young, Retire Young",
    template: "%s | Achievers Club Nashik",
  },
  description:
    "Join the Achievers Club Nashik — Maharashtra's fastest-growing digital entrepreneurship community. Learn SMO, build passive income, and grow your network with 500+ young entrepreneurs. Zero upfront investment. Forever Living Products affiliate.",
  keywords: [
    "Achievers Club Nashik",
    "digital entrepreneurship Nashik",
    "passive income Nashik",
    "Forever Living Products Nashik",
    "FLP Nashik",
    "network marketing Nashik",
    "work from home Nashik",
    "business community Nashik",
    "SMO training Nashik",
    "young entrepreneurs Nashik",
    "FLP Maharashtra",
    "achievers club Maharashtra",
    "make money online Nashik",
    "start business Nashik",
    "achieversnashik.in",
  ],
  authors: [{ name: "Achievers Club Nashik", url: "https://achieversnashik.in" }],
  creator: "Achievers Club Nashik",
  publisher: "Achievers Club Nashik",
  category: "Business",
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
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://achieversnashik.in",
    siteName: "Achievers Club Nashik",
    title: "Achievers Club Nashik — Start Young, Retire Young",
    description: "Join 500+ digital entrepreneurs in Nashik's fastest-growing business community. Learn, network, and generate passive income with zero upfront investment.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Achievers Club Nashik — Start Young, Retire Young",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Achievers Club Nashik — Start Young, Retire Young",
    description: "Join 500+ digital entrepreneurs in Nashik's fastest-growing business community.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://achieversnashik.in",
  },
  verification: {
    google: "ADD_YOUR_GOOGLE_SEARCH_CONSOLE_VERIFICATION_CODE_HERE",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable}`} suppressHydrationWarning>
      <head>
        <ThemeScript />
        {/* Elfsight Google Reviews Widget — paste your actual src URL after creating widget at elfsight.com */}
        {/* <script src="https://static.elfsight.com/platform/platform.js" async></script> */}
        <script src="https://static.elfsight.com/platform/platform.js" async></script>
      </head>
      <body className="antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}