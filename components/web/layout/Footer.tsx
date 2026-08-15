import Link from "next/link";
import {
  Instagram,
  Facebook,
  ExternalLink,
} from "lucide-react";
import type { ContactInfo, SiteSettings } from "@/lib/types";
import { buildWhatsAppUrl } from "@/lib/utils";

interface FooterProps {
  contactInfo: ContactInfo;
  settings: SiteSettings;
}

const footerLinks = {
  menu: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Mitra", href: "/industries" },
    { label: "Produk", href: "/products" },
    { label: "Kategori", href: "/categories" },
  ],
  cart: [
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/contact" },
    { label: "Syarat Ketentuan", href: "/terms" },
    { label: "Panduan", href: "/tutorials" },
  ],
};

export function Footer({ contactInfo, settings }: FooterProps) {
  const waUrl = buildWhatsAppUrl(
    contactInfo.whatsapp,
    contactInfo.whatsappMessage
  );

  return (
    <footer className="bg-gradient-to-br from-[#f7fbfd] via-[#fdf7fc] to-[#f9eaf6] text-[#4b3f49] relative overflow-hidden font-sans border-t border-[#e8dce7]">
      {/* Main Footer */}
      <div className="container mx-auto px-6 lg:px-12 pt-20 pb-48 lg:pb-72 relative z-10">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-16 lg:gap-8 mb-24">

          {/* Brand & Contact Column */}
          <div className="max-w-sm space-y-10">
            {/* Social Icons */}
            <div className="flex items-center gap-4">
              {contactInfo.instagram && (
                <a
                  href={contactInfo.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white transition-all duration-300"
                >
                  <Instagram className="w-5 h-5" strokeWidth={1.5} />
                </a>
              )}
              {contactInfo.facebook && (
                <a
                  href={contactInfo.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white transition-all duration-300"
                >
                  <Facebook className="w-5 h-5" strokeWidth={1.5} />
                </a>
              )}
              {contactInfo.tiktok && (
                <a
                  href={contactInfo.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" stroke="none">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 15.68a6.34 6.34 0 0 0 6.27 6.32 6.32 6.32 0 0 0 6.16-5.83v-7.38a8.27 8.27 0 0 0 4 1.15V6.44a4.93 4.93 0 0 1-1.84-.25z"/>
                  </svg>
                </a>
              )}
            </div>

            {/* Contact Info */}
            <div className="space-y-4 text-[15px] leading-relaxed text-[#5f5560]">
              <p className="whitespace-pre-line">
                {contactInfo.address || "Alamat belum diisi"}
              </p>
              <p>
                <a href={`mailto:${contactInfo.email}`} className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors">
                  {contactInfo.email || "Email belum diisi"}
                </a>
              </p>
              <p>
                <a href={waUrl} target="_blank" rel="noopener noreferrer" className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors">
                  {contactInfo.whatsapp ? `+${contactInfo.whatsapp}` : "Nomor WhatsApp belum diisi"}
                </a>
              </p>
            </div>
          </div>

          {/* Links Columns */}
          <div className="grid grid-cols-2 gap-16 lg:gap-28 w-full lg:w-auto">
            <div>
              <h4 className="font-medium text-[#2f2a33] mb-6 text-sm uppercase tracking-wider">
                MENU
              </h4>
              <ul className="space-y-4">
                {footerLinks.menu.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-[#2f2a33] mb-6 text-sm uppercase tracking-wider">
                KERANJANG
              </h4>
              <ul className="space-y-4">
                {footerLinks.cart.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[15px] text-gray-400 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="relative border-t border-[#e8dce7] pt-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">


          <p className="text-sm text-[#6f6972] max-w-md leading-relaxed">
           Dari kebutuhan ibu dan bayi hingga pelayanan terbaik. Toko Manur hadir menyediakan produk berkualitas untuk mendukung kebutuhan Bunda dan si kecil dengan mudah, aman, dan terpercaya.
          </p>

          <div className="flex gap-8 text-sm text-[#6f6972] font-medium tracking-wide">
            <Link href="/terms" className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors uppercase">
              SYARAT & KETENTUAN
            </Link>
            <Link href="/privacy" className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors uppercase">
              KEBIJAKAN PRIVASI
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-0 w-full overflow-hidden pointer-events-none select-none text-center flex justify-center">
        <h1 className="text-[18vw] leading-[0.75] font-bold text-[#e8dce7] whitespace-nowrap tracking-tighter">
          Toko-Manur
        </h1>
      </div>
    </footer>
  );
}

