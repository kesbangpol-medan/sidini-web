import type { Metadata } from "next";
import { Poppins, Roboto } from "next/font/google";
import "./globals.css";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-poppins",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: "SIDINI - Sistem Informasi Deteksi Dini Kota Medan",
  description: "Sistem Informasi Deteksi Dini yang mengintegrasikan teknologi modern untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian di Kota Medan.",
  keywords: ["SIDINI", "Sistem Informasi Deteksi Dini", "Kota Medan", "Kesbangpol", "Keamanan"],
  authors: [{ name: "Pemerintah Kota Medan" }],
  icons: {
    icon: [
      { url: "/icon_sidini.png", sizes: "16x16", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "32x32", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "48x48", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "64x64", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "96x96", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "128x128", type: "image/png" },
      { url: "/icon_sidini.png", sizes: "256x256", type: "image/png" },
    ],
    shortcut: "/icon_sidini.png",
    apple: [
      { url: "/icon_sidini.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "icon",
        type: "image/png",
        sizes: "16x16",
        url: "/icon_sidini.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "32x32",
        url: "/icon_sidini.png",
      },
      {
        rel: "icon",
        type: "image/png",
        sizes: "48x48",
        url: "/icon_sidini.png",
      },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    title: "SIDINI - Sistem Informasi Deteksi Dini Kota Medan",
    description: "Sistem Informasi Deteksi Dini yang mengintegrasikan teknologi modern untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian di Kota Medan.",
    type: "website",
    locale: "id_ID",
    images: [
      {
        url: "/icon_sidini.png",
        width: 256,
        height: 256,
        alt: "SIDINI Icon",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SIDINI - Sistem Informasi Deteksi Dini Kota Medan",
    description: "Sistem Informasi Deteksi Dini yang mengintegrasikan teknologi modern untuk meningkatkan kesiapsiagaan dan respons cepat terhadap berbagai kejadian di Kota Medan.",
    images: ["/icon_sidini.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className="scroll-smooth">
      <head>
        {/* Favicon configuration */}
        <link rel="icon" type="image/png" sizes="16x16" href="/icon_sidini.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icon_sidini.png" />
        <link rel="icon" type="image/png" sizes="48x48" href="/icon_sidini.png" />
        <link rel="shortcut icon" href="/icon_sidini.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/icon_sidini.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* Theme colors */}
        <meta name="theme-color" content="#1e40af" />
        <meta name="msapplication-TileColor" content="#1e40af" />
        <meta name="msapplication-TileImage" content="/icon_sidini.png" />
        
        {/* Additional favicon formats */}
        <link rel="icon" type="image/x-icon" href="/icon_sidini.png" />
        <link rel="icon" type="image/svg+xml" href="/icon_sidini.png" />
      </head>
      <body
        className={`${poppins.variable} ${roboto.variable} antialiased bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
