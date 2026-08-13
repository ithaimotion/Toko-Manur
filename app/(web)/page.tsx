import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Package } from "lucide-react";
import { HeroSection } from "@/components/web/sections/HeroSection";
import { PromoSection } from "@/components/web/sections/PromoSection";
import { MarketplaceSection } from "@/components/web/sections/MarketplaceSection";
import { Testimonials } from "@/components/web/sections/Testimonials";
import { CTAWhatsApp } from "@/components/web/sections/CTAWhatsApp";
import { ProductCard } from "@/components/web/products/ProductCard";
import { BlogCard } from "@/components/web/blog/BlogCard";
import { SectionTitle } from "@/components/web/ui/SectionTitle";
import { getFeaturedProducts } from "@/app/(web)/actions/product";
import { getContactInfo } from "@/lib/actions/contact";
import { getPublishedBlogs } from "@/app/(web)/actions/blog";
import { getPromos } from "@/lib/actions/promo";
import { getMarketplaceLinks } from "@/lib/actions/marketplace-links";
import { getHeroBanners } from "@/lib/actions/hero-banner";
import type { MarketplaceLink } from "@/lib/types";

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

export const revalidate = 300;

export default async function HomePage() {
  const [featuredProductsRes, recentBlogs, contactResponse, promoResponse, marketplaceResponse, heroBannersResponse] = await Promise.all([
    getFeaturedProducts({ limit: 4 }),
    getPublishedBlogs({ limit: 3 }),
    getContactInfo(),
    getPromos(true),
    getMarketplaceLinks(),
    getHeroBanners(true),
  ]);
  const featuredProducts = (featuredProductsRes.success && featuredProductsRes.data ? featuredProductsRes.data : []) as any[];
  const contact = contactResponse.success ? contactResponse.data : undefined;
  const promos = promoResponse.success && promoResponse.data ? promoResponse.data : [];
  const marketplaceLinks = (marketplaceResponse.success && marketplaceResponse.data ? marketplaceResponse.data : []) as MarketplaceLink[];
  const hero = heroBannersResponse.success && heroBannersResponse.data?.length ? heroBannersResponse.data[0] : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero */}
      {hero && <HeroSection banner={hero as any} />}

      {/* Promo */}
      {promos.length > 0 && <PromoSection promos={promos} />}

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

      {/* Reviews - Apa Kata Mereka */}
      <Testimonials />

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
      {marketplaceLinks.length > 0 && <MarketplaceSection links={marketplaceLinks} />}

      {/* CTA WhatsApp */}
      <CTAWhatsApp
        phone={contact?.whatsapp ?? ""}
        message={contact?.whatsappMessage}
      />
    </>
  );
}
