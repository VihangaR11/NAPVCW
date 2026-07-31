import type { Metadata } from "next";
import { headers } from "next/headers";
import "./globals.css";

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host =
    requestHeaders.get("x-forwarded-host") ??
    requestHeaders.get("host") ??
    "localhost:3000";
  const protocol =
    requestHeaders.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const imageUrl = new URL("/og-login.png", `${protocol}://${host}`).toString();

  return {
    title: "DCFMS Prototype | NAPVCW",
    description:
      "Day 1 demonstration dashboard for the proposed NAPVCW Digital Case Flow Management System.",
    applicationName: "NAPVCW Digital Case Flow Management System",
    generator: "NAPVCW DCFMS Prototype",
    keywords: [
      "NAPVCW",
      "Digital Case Flow Management System",
      "Sri Lanka government",
      "victim and witness protection",
    ],
    robots: {
      index: false,
      follow: false,
    },
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "DCFMS Prototype",
      description: "Digital Case Flow Management System · secure EPF sign-in and role-based access prototype",
      images: [{ url: imageUrl, width: 1680, height: 945 }],
    },
    twitter: {
      card: "summary_large_image",
      title: "DCFMS Prototype",
      description: "Digital Case Flow Management System · secure EPF sign-in and role-based access prototype",
      images: [imageUrl],
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-LK">
      <body>{children}</body>
    </html>
  );
}
