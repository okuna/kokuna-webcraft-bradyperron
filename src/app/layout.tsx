import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const fraunces = localFont({
  src: [
    {
      path: "../../public/fonts/fraunces-thin.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../../public/fonts/fraunces-thin-italic.ttf",
      weight: "100",
      style: "italic",
    },
  ],
  display: "swap",
  variable: "--font-fraunces",
});

export const metadata: Metadata = {
  title: "Brady Perron",
  description:
    "Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.",
  openGraph: {
    title: "Brady Perron",
    description:
      "Brady Perron is a Brooklyn-based Videographer/Director/Editor/Photographer. Rhythm. Range. Poetic. Dynamic.",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fraunces.variable} antialiased`}>
      <body className="min-h-screen overflow-x-hidden bg-white text-black selection:bg-black selection:text-white">
        {children}
      </body>
    </html>
  );
}
