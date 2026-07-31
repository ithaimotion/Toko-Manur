import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Tag, Clock } from "lucide-react";
import type { Promo } from "@toko-manur/types";
import { formatDate } from "@toko-manur/utils";

interface PromoSectionProps {
  promos: Promo[];
}

export function PromoSection({ promos }: PromoSectionProps) {
  const activePromos = promos.filter((p) => p.isActive).slice(0, 3);

  return (
    <section className="section bg-section-alt">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-10">
          <div>
            <div className="badge-primary mb-3">
              <Tag className="w-3.5 h-3.5 mr-1.5" />
              Penawaran Spesial
            </div>
            <h2 className="text-3xl font-bold text-foreground">Promo Terkini</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePromos.map((promo, index) => (
            <PromoCard key={promo.id} promo={promo} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PromoCard({ promo, index }: { promo: Promo; index: number }) {
  const bgColors = [
    "from-blue-50 to-indigo-50 border-blue-100",
    "from-emerald-50 to-teal-50 border-emerald-100",
    "from-amber-50 to-orange-50 border-amber-100",
  ];

  const badgeColors = [
    "bg-primary text-white",
    "bg-emerald-600 text-white",
    "bg-amber-500 text-white",
  ];

  return (
    <div
      className={`relative rounded-2xl border bg-gradient-to-br ${bgColors[index % 3]} p-6 overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1`}
    >
      {/* Badge */}
      {promo.badgeText && (
        <span
          className={`absolute top-4 right-4 ${badgeColors[index % 3]} text-xs font-bold px-3 py-1 rounded-full`}
        >
          {promo.badgeText}
        </span>
      )}

      {/* Content */}
      <div className="pr-20">
        <h3 className="text-xl font-bold text-slate-900 mb-2">{promo.title}</h3>
        {promo.subtitle && (
          <p className="text-slate-600 font-medium text-sm mb-2">{promo.subtitle}</p>
        )}
        {promo.description && (
          <p className="text-slate-500 text-sm leading-relaxed mb-4">{promo.description}</p>
        )}
      </div>

      {/* Validity */}
      {promo.validUntil && (
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
          <Clock className="w-3.5 h-3.5" />
          Berlaku hingga {formatDate(promo.validUntil)}
        </div>
      )}

      {/* CTA */}
      {promo.ctaUrl && (
        <Link
          href={promo.ctaUrl}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary-700 transition-colors"
        >
          {promo.ctaText}
          <ArrowRight className="w-4 h-4" />
        </Link>
      )}

      {/* Decoration */}
      <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-white/30 rounded-full" />
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/20 rounded-full" />
    </div>
  );
}
