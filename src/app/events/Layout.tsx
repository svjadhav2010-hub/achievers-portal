import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Events & Webinars",
  description: "Upcoming events, webinars, and live training sessions by Achievers Club Nashik. Daily live sessions at 8 PM, SMO workshops, meetups, and more for digital entrepreneurs in Nashik.",
  openGraph: {
    title: "Events & Webinars — Achievers Club Nashik",
    description: "Upcoming events, webinars, and live training sessions for digital entrepreneurs in Nashik.",
    url: "https://achieversnashik.in/events",
  },
  alternates: { canonical: "https://achieversnashik.in/events" },
};

export default function EventsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}