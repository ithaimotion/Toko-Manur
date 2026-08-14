import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { MarketplacePlatform } from "@/lib/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

export function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactNumber(num: number): string {
  const formatter = new Intl.NumberFormat("id-ID", {
    notation: "compact",
    maximumFractionDigits: 1,
  });
  return formatter.format(num);
}

export function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function formatDateShort(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function timeAgo(dateString: string | undefined | null): string {
  if (!dateString) return "-";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Hari ini";
  if (diffDays === 1) return "Kemarin";
  if (diffDays < 7) return `${diffDays} hari lalu`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} minggu lalu`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} bulan lalu`;
  return `${Math.floor(diffDays / 365)} tahun lalu`;
}

export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number
): { data: T[]; meta: { currentPage: number; totalPages: number; totalItems: number; itemsPerPage: number } } {
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: array.slice(start, end),
    meta: {
      currentPage: page,
      totalPages: Math.ceil(array.length / limit),
      totalItems: array.length,
      itemsPerPage: limit,
    },
  };
}

export function getMarketplaceName(platform: MarketplacePlatform): string {
  const names: Record<MarketplacePlatform, string> = {
    shopee: "Shopee",
    tokopedia: "Tokopedia",
    tiktok: "TikTok Shop",
    lazada: "Lazada",
    akulaku: "Akulaku",
    custom: "Marketplace",
  };
  return names[platform];
}

export function getMarketplaceColor(platform: MarketplacePlatform): string {
  const colors: Record<MarketplacePlatform, string> = {
    shopee: "#EE4D2D",
    tokopedia: "#00AA5B",
    tiktok: "#000000",
    lazada: "#0F146D",
    akulaku: "#E52E2D",
    custom: "#6366F1",
  };
  return colors[platform];
}

export function buildWhatsAppUrl(phone: string, message?: string): string {
  const cleaned = phone.replace(/\D/g, "");
  const encoded = message ? encodeURIComponent(message) : "";
  return `https://wa.me/${cleaned}${encoded ? `?text=${encoded}` : ""}`;
}

export function buildCanonicalUrl(path: string, baseUrl = "https://tokomanur.id"): string {
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

export function generateStars(rating: number, max = 5): { filled: number; empty: number } {
  return { filled: Math.round(rating), empty: max - Math.round(rating) };
}
