import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Brady Perron",
  description:
    "Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.",
  openGraph: {
    title: "Brady Perron",
    description:
      "Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.",
    type: "website",
    images: [
      {
        url: "https://cdn.sanity.io/images/qrv69xlg/production/ce4e709dd358c6174402b1342cef9809f85035b5-3339x5035.jpg",
        width: 3339,
        height: 5035,
        alt: "Brady Perron",
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-white text-black overflow-x-hidden selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
