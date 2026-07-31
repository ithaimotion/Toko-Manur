import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Admin — Toko Manur Baby Care", template: "%s | Admin Toko Manur Baby Care" },
  description: "Admin Dashboard Toko Manur Baby Care CMS",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <div className="flex h-screen overflow-hidden">
          {/* Sidebar */}
          <Sidebar />

          {/* Main */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <Header />
            <main className="flex-1 overflow-y-auto p-6 bg-background">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
