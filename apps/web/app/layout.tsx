import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { mockSettings } from "@toko-manur/mock-data";
import { getContactInfo } from "@/../admin/app/actions/contact";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://tokomanur.id"),
  title: {
    default: mockSettings.seoTitle ?? "Toko Manur Baby Care — Pusat Perlengkapan Bayi Terlengkap",
    template: `%s | Toko Manur Baby Care`,
  },
  description: mockSettings.seoDescription,
  keywords: mockSettings.seoKeywords,
  authors: [{ name: "Toko Manur" }],
  creator: "Toko Manur",
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://tokomanur.id",
    siteName: "Toko Manur",
    title: mockSettings.seoTitle ?? "Toko Manur",
    description: mockSettings.seoDescription,
    images: [{ url: "/og-image.jpg", width: 1200, height: 630, alt: "Toko Manur" }],
  },
  twitter: {
    card: "summary_large_image",
    title: mockSettings.seoTitle ?? "Toko Manur",
    description: mockSettings.seoDescription,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const contactResponse = await getContactInfo();
  const contactInfo = contactResponse.success ? contactResponse.data : undefined;

  return (
    <html lang="id" className={`${inter.variable} ${plusJakarta.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer contactInfo={contactInfo ?? { id: "", address: "", email: "", whatsapp: "", updatedAt: new Date().toISOString() }} settings={mockSettings} />
      </body>
    </html>
  );
}
