import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import ToastProvider from "@/components/admin/ui/ToastProvider";
import QueryProvider from "@/components/admin/providers/QueryProvider";

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

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <QueryProvider>
          <ToastProvider />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}
