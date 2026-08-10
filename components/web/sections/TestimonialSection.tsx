import Image from "next/image";
import { Star, Quote } from "lucide-react";
import type { Testimonial } from "@/lib/types";

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <div className="card-base p-6 h-full flex flex-col relative group hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300">
      {/* Quote icon */}
      <Quote className="absolute top-5 right-5 w-8 h-8 text-primary-100 group-hover:text-primary-200 transition-colors" />

      {/* Stars */}
      <div className="flex items-center gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating
                ? "text-amber-400 fill-amber-400"
                : "text-slate-200"
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-6 italic">
        &ldquo;{testimonial.content}&rdquo;
      </p>

      {/* Author */}
      <div className="flex items-center gap-3 pt-4 border-t border-border">
        {testimonial.customerPhoto ? (
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 ring-2 ring-primary-100">
            <Image
              src={testimonial.customerPhoto}
              alt={testimonial.customerName}
              fill
              className="object-cover"
              sizes="44px"
            />
          </div>
        ) : (
          <div className="w-11 h-11 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
            <span className="text-primary-600 font-bold text-sm">
              {testimonial.customerName.charAt(0)}
            </span>
          </div>
        )}
        <div>
          <p className="font-semibold text-slate-900 text-sm">{testimonial.customerName}</p>
          {testimonial.customerTitle && (
            <p className="text-xs text-slate-400">{testimonial.customerTitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export function TestimonialSection({ testimonials }: { testimonials: Testimonial[] }) {
  const active = testimonials.filter((t) => t.isActive).slice(0, 6);

  return (
    <section className="section bg-section-alt overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-primary inline-flex mb-4">
            <Star className="w-3.5 h-3.5 mr-1.5 fill-primary-600" />
            Testimoni Pelanggan
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Apa Kata{" "}
            <span className="gradient-text">Bunda</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto">
            Ribuan Bunda telah membuktikan kualitas produk dan layanan Toko Manur Baby Care
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-12 max-w-lg mx-auto text-center">
          {[
            { value: "10,000+", label: "Bunda Puas" },
            { value: "4.9/5", label: "Rating Rata-rata" },
            { value: "99%", label: "Rekomendasi" },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-2xl font-bold text-primary">{value}</p>
              <p className="text-xs text-slate-500 mt-1">{label}</p>
            </div>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {active.map((t) => (
            <TestimonialCard key={t.id} testimonial={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
