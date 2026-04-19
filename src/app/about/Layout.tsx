import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about the Achievers Club Nashik — our story, leadership team, mission, and values. Founded in 2021, we are Maharashtra's fastest-growing FLP digital entrepreneurship community with 500+ members.",
  openGraph: {
    title: "About Achievers Club Nashik",
    description: "Our story, mission, and the team behind Nashik's fastest-growing digital entrepreneurship community.",
    url: "https://achieversnashik.in/about",
  },
  alternates: { canonical: "https://achieversnashik.in/about" },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}