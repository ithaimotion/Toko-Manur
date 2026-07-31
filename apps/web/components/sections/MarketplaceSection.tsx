import Link from "next/link";
import { ShoppingBag, ExternalLink, Store } from "lucide-react";
import type { MarketplaceLink } from "@toko-manur/types";
import { getMarketplaceColor, getMarketplaceName } from "@toko-manur/utils";

interface MarketplaceCardProps {
  link: MarketplaceLink;
}

const platformLogos: Record<string, string> = {
  shopee: "🛍️",
  tokopedia: "🟢",
  tiktok: "🎵",
  lazada: "🔵",
  custom: "🏪",
};

export function MarketplaceCard({ link }: MarketplaceCardProps) {
  const color = getMarketplaceColor(link.platform);
  const emoji = platformLogos[link.platform] ?? "🏪";

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group card-base p-6 flex flex-col items-center text-center hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Logo placeholder */}
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform duration-300 group-hover:scale-110 shadow-sm"
        style={{ backgroundColor: `${color}15`, border: `2px solid ${color}30` }}
      >
        {emoji}
      </div>

      <h3 className="font-bold text-slate-900 text-lg mb-1.5 group-hover:text-primary transition-colors">
        {link.name}
      </h3>
      {link.description && (
        <p className="text-slate-500 text-xs leading-relaxed mb-4">{link.description}</p>
      )}

      <span
        className="inline-flex items-center gap-1.5 text-sm font-semibold mt-auto px-4 py-2 rounded-lg transition-all duration-200 group-hover:shadow-sm"
        style={{ color, backgroundColor: `${color}12` }}
      >
        Beli di {link.name}
        <ExternalLink className="w-3.5 h-3.5" />
      </span>
    </a>
  );
}

export function MarketplaceSection({ links }: { links: MarketplaceLink[] }) {
  const activeLinks = links.filter((l) => l.isActive).sort((a, b) => a.order - b.order);

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-primary inline-flex mb-4">
            <Store className="w-3.5 h-3.5 mr-1.5" />
            Tersedia di
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Beli di{" "}
            <span className="gradient-text">Marketplace Favorit</span>
          </h2>
          <p className="text-slate-500 max-w-lg mx-auto">
            Produk Toko Manur tersedia di berbagai platform marketplace terpercaya. Belanja mudah, aman, dan cepat.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 max-w-3xl mx-auto">
          {activeLinks.map((link) => (
            <MarketplaceCard key={link.id} link={link} />
          ))}
        </div>

        {/* Bottom note */}
        <p className="text-center text-slate-400 text-sm mt-10">
          <ShoppingBag className="w-4 h-4 inline mr-2 text-primary-400" />
          Semua transaksi dijamin aman melalui sistem pembayaran marketplace
        </p>
      </div>
    </section>
  );
}
