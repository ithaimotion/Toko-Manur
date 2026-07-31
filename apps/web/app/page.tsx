import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { HeroSection } from "@/components/sections/HeroSection";
import { PromoSection } from "@/components/sections/PromoSection";
import { WhyChooseUs } from "@/components/sections/WhyChooseUs";
import { TestimonialSection } from "@/components/sections/TestimonialSection";
import { MarketplaceSection } from "@/components/sections/MarketplaceSection";
import { CTAWhatsApp } from "@/components/sections/CTAWhatsApp";
import { ProductCard } from "@/components/products/ProductCard";
import { BlogCard } from "@/components/blog/BlogCard";
import { SectionTitle } from "@/components/ui/SectionTitle";
import {
  mockHeroBanners,
  mockPromos,
  mockProducts,
  mockBlogs,
  mockTestimonials,
  mockMarketplaceLinks,
  mockContactInfo,
} from "@toko-manur/mock-data";

export const metadata: Metadata = {
  title: "Toko Manur Baby Care — Pusat Popok & Perlengkapan Bayi Termurah",
  description:
    "Toko Manur menyediakan popok MamyPoko, Merries, Pampers, Sweety, tisu basah, dan perlengkapan mandi bayi 100% original dengan pengiriman instan.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Toko Manur Baby Care",
  description: "Toko perlengkapan bayi dan popok termurah di Indonesia",
  url: "https://tokomanurbaby.id",
  telephone: "+6281234567890",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Kasih Bunda No. 88",
    addressLocality: "Malang",
    addressRegion: "Jawa Timur",
    postalCode: "65141",
    addressCountry: "ID",
  },
};

export default function HomePage() {
  const hero = mockHeroBanners.find((b) => b.isActive && b.order === 1) ?? mockHeroBanners[0];
  const featuredProducts = mockProducts.filter((p) => p.isFeatured && p.status === "published").slice(0, 4);
  const recentBlogs = mockBlogs.filter((b) => b.status === "published").slice(0, 3);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      <HeroSection banner={hero} />

      {/* Promo */}
      <PromoSection promos={mockPromos} />

      {/* Featured Products */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              badge="Produk Pilihan"
              title="Kebutuhan"
              highlight="Si Kecil"
              description="Popok dan perawatan bayi terlaris yang dipercaya ribuan Bunda"
              align="left"
              className="mb-0"
            />
            <Link
              href="/products"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors shrink-0 ml-8"
            >
              Lihat Semua
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center mt-8 sm:hidden">
            <Link href="/products" className="btn-secondary">
              <Package className="w-4 h-4" />
              Lihat Semua Produk
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <WhyChooseUs />

      {/* Testimonials */}
      <TestimonialSection testimonials={mockTestimonials} />

      {/* Blog Preview */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <SectionTitle
              badge="Artikel Terbaru"
              title="Edukasi &"
              highlight="Parenting"
              description="Pelajari tips merawat si kecil dan panduan parenting dari ahlinya"
              align="left"
              className="mb-0"
            />
            <Link
              href="/blog"
              className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 shrink-0 ml-8 transition-colors"
            >
              Semua Artikel
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentBlogs.map((blog, i) => (
              <BlogCard key={blog.id} blog={blog} featured={i === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <MarketplaceSection links={mockMarketplaceLinks} />

      {/* CTA WhatsApp */}
      <CTAWhatsApp
        phone={mockContactInfo.whatsapp}
        message={mockContactInfo.whatsappMessage}
      />
    </>
  );
}
