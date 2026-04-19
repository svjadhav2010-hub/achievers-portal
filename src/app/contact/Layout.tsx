import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Achievers Club Nashik. Reach us via WhatsApp, email, or our contact form. We respond within 24 hours. Located in Nashik, Maharashtra.",
  openGraph: {
    title: "Contact Achievers Club Nashik",
    description: "Reach us via WhatsApp, email, or contact form. We respond within 24 hours.",
    url: "https://achieversnashik.in/contact",
  },
  alternates: { canonical: "https://achieversnashik.in/contact" },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}