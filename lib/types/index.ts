// ================================
// Core Entity Types
// ================================

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Brand {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
}

export interface ProductSpecification {
  label: string;
  value: string;
}

export type ProductStatus = "published" | "draft";

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: ProductImage[];
  brandId: string;
  brand?: Brand;
  specifications: ProductSpecification[];
  price?: number;
  priceLabel?: string; // e.g. "Hubungi Kami"
  isFeatured: boolean;
  status: ProductStatus;
  marketplaceLinks?: MarketplaceProductLink[];
  createdAt: string;
  updatedAt: string;
}

export interface MarketplaceProductLink {
  platform: MarketplacePlatform;
  url: string;
}

// ================================
// Blog
// ================================

export type BlogStatus = "published" | "draft";

export interface BlogAuthor {
  id: string;
  name: string;
  avatar?: string;
  role: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  author: BlogAuthor;
  categoryId?: string;
  categoryName?: string;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  readingTime: number; // in minutes
  status: BlogStatus;
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// Testimonial
// ================================

export interface Testimonial {
  id: string;
  customerName: string;
  customerPhoto?: string;
  customerTitle?: string;
  rating: number; // 1-5
  content: string;
  isActive: boolean;
  createdAt: string;
}

// ================================
// Hero Banner
// ================================

export interface HeroBanner {
  id: string;
  title: string;
  subtitle: string;
  description?: string;
  image?: string;
  ctaText?: string;
  ctaUrl?: string;
  ctaSecondaryText?: string;
  ctaSecondaryUrl?: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
  carouselItems?: HeroCarouselItem[];
}

export interface HeroCarouselItem {
  id: string;
  heroBannerId: string;
  marketplace: string;
  image: string;
  trustCount: string;
  rating: string;
  isActive: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

// ================================
// Promo
// ================================

export interface Promo {
  id: string;
  title: string;
  subtitle?: string;
  description?: string;
  image?: string;
  badgeText?: string;
  ctaText?: string;
  ctaUrl?: string;
  backgroundColor?: string;
  isActive: boolean;
  order: number;
  validUntil?: string;
  createdAt: string;
}

// ================================
// Marketplace
// ================================

export type MarketplacePlatform =
  | "shopee"
  | "tokopedia"
  | "tiktok"
  | "lazada"
  | "custom";

export interface MarketplaceLink {
  id: string;
  platform: MarketplacePlatform;
  name: string;
  url: string;
  logo?: string;
  description?: string;
  isActive: boolean;
  order: number;
}

// ================================
// Company Profile
// ================================

export interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon?: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  number: string;
  issuedBy: string;
  issuedDate: string;
}

export interface CompanyProfile {
  id: string;
  about: string;
  vision: string;
  mission: string[];
  values: CompanyValue[];
  brandStory: string;
  founded: string;
  legalDocuments: LegalDocument[];
  updatedAt: string;
}

// ================================
// Contact
// ================================

export interface ContactInfo {
  id: string;
  address: string;
  email: string;
  whatsapp: string;
  whatsappMessage?: string;
  googleMapsEmbed?: string;
  googleMapsUrl?: string;
  latitude?: string;
  longitude?: string;
  businessHours?: string;
  updatedAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  updatedAt: string;
}

// ================================
// User
// ================================

export type UserRole = "superadmin" | "admin" | "editor";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

// ================================
// Settings
// ================================

export interface SocialMedia {
  platform: string;
  url: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  logo?: string;
  favicon?: string;
  socialMedia: SocialMedia[];
  footerText?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
  googleAnalyticsId?: string;
  googleSearchConsoleVerification?: string;
  metaRobotsDefault?: string;
  updatedAt: string;
}

// ================================
// UI / Utility Types
// ================================

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  color?: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface FilterState {
  search: string;
  category: string;
  status: string;
  page: number;
  limit: number;
}
