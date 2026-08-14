import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { MessageCircle, ShoppingBag, ExternalLink } from "lucide-react";
import { Breadcrumb } from "@/components/web/ui/Breadcrumb";
import { ProductCard } from "@/components/web/products/ProductCard";
import { buildWhatsAppUrl } from "@/lib/utils";
import { getMarketplaceIcon } from "@/components/web/ui/MarketplaceIcons";
import { getProductBySlug, getProducts } from "@/app/(web)/actions/product";

interface Props {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const res = await getProductBySlug(slug);
  if (!res.success || !res.data) return { title: "Produk Tidak Ditemukan" };
  const product = res.data;
  const images = Array.isArray(product.images) ? product.images : [];
  return {
    title: product.name,
    description: product.shortDescription || product.description,
    openGraph: {
      title: product.name,
      description: product.shortDescription || product.description,
      images: images.map((img: any) => ({ url: img.url })),
    },
  };
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const res = await getProductBySlug(slug);
  if (!res.success || !res.data) notFound();
  
  const product = res.data;
  const images = Array.isArray(product.images) ? (product.images as any[]) : [];
  const primaryImage = images.find((img: any) => img.isPrimary) ?? images[0];
  
  const relatedRes = await getProducts({ brand: product.brand?.slug });
  let related = relatedRes.success && relatedRes.data ? relatedRes.data : [];
  related = related.filter((p: any) => p.id !== product.id).slice(0, 4);

  const waMessage = `Halo Toko Manur, saya tertarik dengan produk *${product.name}*. Bisa minta informasi lebih lanjut?`;
  const waUrl = buildWhatsAppUrl("6281234567890", waMessage);
  
  const specifications = Array.isArray(product.specifications) ? (product.specifications as any[]) : [];
  const marketplaceLinks = Array.isArray(product.marketplaceLinks) ? (product.marketplaceLinks as any[]) : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: images.map((i: any) => i.url),
    offers: product.price
      ? { "@type": "Offer", price: product.price, priceCurrency: "IDR", availability: "https://schema.org/InStock" }
      : undefined,
  };

  return (
    <div className="pt-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb
            items={[
              { label: "Produk", href: "/products" },
              { label: product.brand?.name ?? "Brand", href: `/products?brand=${product.brandId}` },
              { label: product.name },
            ]}
          />
        </div>
      </div>

      {/* Product Detail */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Gallery */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-50">
                {primaryImage && (
                  <Image
                    src={primaryImage.url}
                    alt={primaryImage.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                  />
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {images.map((img: any, idx: number) => (
                    <div
                      key={idx}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                        img.isPrimary ? "border-primary" : "border-border hover:border-primary-300"
                      }`}
                    >
                      <Image src={img.url} alt={img.alt || "Product image"} fill className="object-cover" sizes="80px" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div>
              {product.brand && (
                <Link
                  href={`/products?brand=${product.brandId}`}
                  className="badge-primary text-xs mb-4 inline-block hover:bg-primary-200 transition-colors"
                >
                  {product.brand.name}
                </Link>
              )}
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 leading-tight">
                {product.name}
              </h1>

              {/* Marketplace / CTA */}
              <div className="mb-6 p-4 bg-slate-50 rounded-xl border border-border">
                <p className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4" />
                  Beli Produk Ini Di:
                </p>
                {marketplaceLinks.length > 0 ? (
                  <div className="flex flex-wrap gap-3">
                    {marketplaceLinks.map((link: any) => {
                      const p = link.platform.toUpperCase();
                      let logoPath = null;
                      if (p === "TOKOPEDIA" || p === "TIKTOK") logoPath = "/logo-marketplace/Tiktok-Tokopedia.png";
                      else if (p === "SHOPEE") logoPath = "/logo-marketplace/Shopee.png";
                      else if (p === "LAZADA") logoPath = "/logo-marketplace/Lazada.png";
                      else if (p === "AKULAKU") logoPath = "/logo-marketplace/lama-pencairan-akulaku-tuwaga.png";
                      
                      return (
                        <a
                          key={link.platform}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-4 py-3 rounded-xl border border-border bg-white hover:border-slate-300 hover:shadow-md transition-all hover:-translate-y-0.5"
                          title={link.platform}
                        >
                          {logoPath ? (
                            <Image src={logoPath} alt={link.platform} width={100} height={40} className="h-7 w-auto object-contain" />
                          ) : (
                            <span className="font-bold uppercase text-slate-700">{link.platform}</span>
                          )}
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                        </a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">
                    Produk ini belum tersedia di marketplace. Silakan hubungi kami via WhatsApp.
                  </p>
                )}
              </div>

              {/* Short Description */}
              <p className="text-slate-600 leading-relaxed mb-6">{product.shortDescription}</p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp flex-1 justify-center"
                >
                  <MessageCircle className="w-5 h-5" />
                  Tanya via WhatsApp
                </a>
              </div>



              {/* Specs */}
              {specifications.length > 0 && (
                <div>
                  <h3 className="font-bold text-slate-900 mb-4">Spesifikasi</h3>
                  <div className="divide-y divide-border rounded-xl border border-border overflow-hidden">
                    {specifications.map((spec: any, idx: number) => (
                      <div key={idx} className="flex items-center py-3 px-4">
                        <span className="text-slate-500 text-sm w-40 shrink-0">{spec.label}</span>
                        <span className="text-slate-900 text-sm font-medium">{spec.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Full Description */}
          <div className="mt-16 max-w-3xl">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Deskripsi Produk</h2>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p>{product.description}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {related.length > 0 && (
        <section className="section bg-section-alt">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">Produk Serupa</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p as any} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
