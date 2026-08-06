import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Truck, Shield, Award, Leaf, Banknote, Gift } from "lucide-react";
import type { HeroBanner } from "@toko-manur/types";

interface HeroSectionProps {
  banner: HeroBanner;
}

export function HeroSection({ banner }: HeroSectionProps) {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-hero pt-20">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-emerald-100 rounded-full blur-3xl opacity-50" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-50 rounded-full blur-3xl opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center py-12 lg:py-20">
          {/* Content */}
          <div className="animate-fade-in-up">
            {/* Badge */}
            <div className="badge-primary inline-flex mb-6 animate-fade-in-up">
              Selamat Datang Para Bunda
            </div>

            <div className="relative h-28 sm:h-40 lg:h-52 w-full max-w-[800px] mb-8">
              <Image 
                src="/logo-manur.png"
                alt="Toko Manur"
                fill
                className="object-contain object-left"
                priority
              />
            </div>

            <p className="text-lg text-slate-600 mb-3 font-medium">{banner.subtitle}</p>
            <p className="text-base text-slate-500 mb-8 max-w-lg leading-relaxed">
              {banner.description}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              {banner.ctaUrl && (
                <Link href={banner.ctaUrl} className="btn-primary text-base px-8 py-3.5">
                  {banner.ctaText}
                  <ArrowRight className="w-5 h-5" />
                </Link>
              )}
              {banner.ctaSecondaryUrl && (
                <a
                  href={banner.ctaSecondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-whatsapp text-base px-8 py-3.5"
                >
                  {banner.ctaSecondaryText}
                </a>
              )}
            </div>

            {/* Trust Badges Marquee */}
            <div className="relative mt-12 space-y-4 overflow-hidden w-full mask-edges">
              {/* Row 1: Marquee Left */}
              <div className="flex w-max animate-marquee-left hover:[animation-play-state:paused]">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 pr-4">
                    {[
                      { icon: Shield, label: "Produk Tersertifikasi" },
                      { icon: Truck, label: "Pengiriman Cepat" },
                      { icon: Award, label: "Kualitas Premium" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label + i}
                        className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl shadow-sm text-sm text-slate-700 whitespace-nowrap border border-slate-100"
                      >
                        <div className="w-7 h-7 bg-primary-50 rounded-md flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-primary-600" />
                        </div>
                        <span className="font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Row 2: Marquee Right */}
              <div className="flex w-max animate-marquee-right hover:[animation-play-state:paused]">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-4 pr-4">
                    {[
                      { icon: Leaf, label: "Ramah Lingkungan" },
                      { icon: Banknote, label: "Harga Terbaik" },
                      { icon: Gift, label: "Promo Spesial" },
                    ].map(({ icon: Icon, label }) => (
                      <div
                        key={label + i}
                        className="flex items-center gap-3 px-4 py-2.5 bg-white rounded-xl shadow-sm text-sm text-slate-700 whitespace-nowrap border border-slate-100"
                      >
                        <div className="w-7 h-7 bg-emerald-50 rounded-md flex items-center justify-center shrink-0">
                          <Icon className="w-4 h-4 text-emerald-600" />
                        </div>
                        <span className="font-semibold">{label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-scale-in delay-200 hidden lg:block">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <Image
                src={banner.image}
                alt={banner.title}
                fill
                className="object-cover"
                priority
                sizes="(max-width: 1024px) 0vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
            </div>

            {/* Floating card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-card p-4 flex items-center gap-3 animate-fade-in-up delay-400">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Award className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-slate-500">Kepercayaan</p>
                <p className="font-bold text-slate-900 text-lg">5,000+</p>
                <p className="text-xs text-slate-500">Bunda Puas</p>
              </div>
            </div>

            {/* Rating card */}
            <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-card p-3 animate-fade-in-up delay-300">
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-amber-400 text-lg">★</span>
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">Rating 4.9/5</p>
            </div>
          </div>
        </div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" className="w-full h-auto" preserveAspectRatio="none">
          <path d="M0,40 C360,0 1080,80 1440,40 L1440,60 L0,60 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
