import { MessageCircle, Phone, ArrowRight } from "lucide-react";
import { buildWhatsAppUrl } from "@toko-manur/utils";

interface CTAWhatsAppProps {
  phone: string;
  message?: string;
}

export function CTAWhatsApp({ phone, message }: CTAWhatsAppProps) {
  const waUrl = buildWhatsAppUrl(phone, message);

  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary-600 via-primary-500 to-indigo-600 px-8 py-16 text-center">
          {/* Decorations */}
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="absolute top-1/2 left-1/4 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
              <MessageCircle className="w-4 h-4" />
              Konsultasi Gratis
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 text-balance">
              Ada Pertanyaan?
              <br />
              <span className="text-primary-200">Kami Siap Membantu!</span>
            </h2>
            <p className="text-primary-100 text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Hubungi tim ahli kami via WhatsApp untuk konsultasi ketersediaan stok, rekomendasi popok, atau pemesanan instan.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 bg-[#25D366] hover:bg-[#1ebe5d] text-white font-bold px-8 py-4 rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl text-base group"
              >
                <MessageCircle className="w-5 h-5" />
                Chat via WhatsApp
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href={`tel:+${phone}`}
                className="inline-flex items-center gap-3 bg-white/15 hover:bg-white/25 border border-white/30 text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 backdrop-blur-sm text-base"
              >
                <Phone className="w-5 h-5" />
                Telepon Kami
              </a>
            </div>

            <p className="text-primary-200 text-sm mt-6">
              ⏰ Jam operasional: Setiap Hari, 07.00 – 22.00 WIB
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
