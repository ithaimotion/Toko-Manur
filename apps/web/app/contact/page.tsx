import type { Metadata } from "next";
import { MapPin, Mail, MessageCircle, Clock, Phone } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ContactForm } from "@/components/contact/ContactForm";
import { mockContactInfo } from "@toko-manur/mock-data";
import { buildWhatsAppUrl } from "@toko-manur/utils";

export const metadata: Metadata = {
  title: "Kontak Kami",
  description: "Hubungi Toko Manur via WhatsApp, email, atau kunjungi kantor kami. Tim kami siap membantu kebutuhan perlengkapan bayi Anda.",
};

export default function ContactPage() {
  const contact = mockContactInfo;
  const waUrl = buildWhatsAppUrl(contact.whatsapp, contact.whatsappMessage);

  return (
    <div className="pt-20">
      {/* Breadcrumb */}
      <div className="bg-slate-50 border-b border-border py-3">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Breadcrumb items={[{ label: "Kontak" }]} />
        </div>
      </div>

      {/* Hero */}
      <section className="bg-hero section-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="badge-primary inline-flex mb-4">
            <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
            Hubungi Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Kami Siap <span className="gradient-text">Membantu Anda</span>
          </h1>
          <p className="text-slate-500 max-w-xl mx-auto">
            Punya pertanyaan tentang produk popok atau perlengkapan bayi? Jangan ragu untuk menghubungi tim kami melalui berbagai saluran komunikasi yang tersedia.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="section bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact Info */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-2xl font-bold text-slate-900">Informasi Kontak</h2>

              {/* Info Cards */}
              <div className="space-y-4">
                <div className="card-base p-5 flex items-start gap-4">
                  <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Alamat</p>
                    <p className="text-slate-500 text-sm leading-relaxed">{contact.address}</p>
                  </div>
                </div>

                <a
                  href={`mailto:${contact.email}`}
                  className="card-base p-5 flex items-start gap-4 hover:shadow-card-hover hover:border-primary-200 transition-all group block"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">Email</p>
                    <p className="text-primary-600 text-sm group-hover:underline">{contact.email}</p>
                  </div>
                </a>

                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card-base p-5 flex items-start gap-4 hover:shadow-card-hover hover:border-emerald-200 transition-all group block"
                >
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center shrink-0">
                    <MessageCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 mb-1">WhatsApp</p>
                    <p className="text-emerald-600 text-sm group-hover:underline">+{contact.whatsapp}</p>
                    <p className="text-xs text-slate-400 mt-0.5">Chat langsung dengan tim kami</p>
                  </div>
                </a>

                {contact.businessHours && (
                  <div className="card-base p-5 flex items-start gap-4">
                    <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-amber-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 mb-1">Jam Operasional</p>
                      <p className="text-slate-500 text-sm">{contact.businessHours}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Quick WhatsApp CTA */}
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-whatsapp w-full justify-center"
              >
                <MessageCircle className="w-5 h-5" />
                Chat WhatsApp Sekarang
              </a>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <div className="card-base p-8">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Kirim Pesan</h2>
                <p className="text-slate-500 text-sm mb-8">
                  Isi formulir di bawah ini dan kami akan menghubungi Anda dalam 1x24 jam kerja.
                </p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      {contact.googleMapsEmbed && (
        <section className="section-sm bg-section-alt">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6 text-center">Lokasi Kami</h2>
            <div className="rounded-2xl overflow-hidden border border-border shadow-card h-80 md:h-96">
              <iframe
                src={contact.googleMapsEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Peta Lokasi Toko Manur"
              />
            </div>
            {contact.googleMapsUrl && (
              <div className="text-center mt-4">
                <a
                  href={contact.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-secondary text-sm inline-flex"
                >
                  <MapPin className="w-4 h-4" />
                  Buka di Google Maps
                </a>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}
