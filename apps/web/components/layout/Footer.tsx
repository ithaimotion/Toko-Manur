import Link from "next/link";
import {
  Baby,
  MapPin,
  Mail,
  Phone,
  Instagram,
  Facebook,
  Youtube,
  ExternalLink,
} from "lucide-react";
import type { ContactInfo, SiteSettings } from "@toko-manur/types";
import { buildWhatsAppUrl } from "@toko-manur/utils";

interface FooterProps {
  contactInfo: ContactInfo;
  settings: SiteSettings;
}

const footerLinks = {
  company: [
    { label: "Tentang Kami", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Kontak", href: "/contact" },
  ],
  products: [
    { label: "Popok Celana", href: "/products?category=popok-celana" },
    { label: "Popok Perekat", href: "/products?category=popok-perekat" },
    { label: "Tisu Basah", href: "/products?category=tisu-basah" },
    { label: "Perawatan Kulit Bayi", href: "/products?category=perawatan-kulit-bayi" },
    { label: "Perlengkapan Menyusui", href: "/products?category=perlengkapan-menyusui" },
  ],
  marketplace: [
    { label: "Shopee", href: "https://shopee.co.id/tokomanur", external: true },
    { label: "Tokopedia", href: "https://tokopedia.com/tokomanur", external: true },
    { label: "TikTok Shop", href: "https://tiktok.com/@tokomanur", external: true },
    { label: "Lazada", href: "https://lazada.co.id/tokomanur", external: true },
  ],
};

const SocialIcon = ({ platform }: { platform: string }) => {
  switch (platform.toLowerCase()) {
    case "instagram": return <Instagram className="w-4 h-4" />;
    case "facebook": return <Facebook className="w-4 h-4" />;
    case "youtube": return <Youtube className="w-4 h-4" />;
    default: return <ExternalLink className="w-4 h-4" />;
  }
};

export function Footer({ contactInfo, settings }: FooterProps) {
  const waUrl = buildWhatsAppUrl(
    contactInfo.whatsapp,
    contactInfo.whatsappMessage
  );

  return (
    <footer className="bg-slate-900 text-slate-300">
      {/* Main Footer */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link
              href="/"
              className="flex items-center gap-2.5 font-bold text-xl text-white hover:text-primary-400 transition-colors group mb-4"
            >
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center">
                <Baby className="w-5 h-5 text-white" />
              </div>
              <span>Toko Manur Baby</span>
            </Link>
            <p className="text-slate-400 leading-relaxed mb-6 text-sm max-w-sm">
              {settings.siteTagline}. Sahabat belanja Bunda terpercaya yang menghadirkan produk original sejak 2018.
            </p>

            {/* Contact Info */}
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin className="w-4 h-4 mt-0.5 text-primary-400 shrink-0" />
                <span>{contactInfo.address}</span>
              </div>
              <a
                href={`mailto:${contactInfo.email}`}
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Mail className="w-4 h-4 text-primary-400 shrink-0" />
                {contactInfo.email}
              </a>
              <a
                href={waUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 text-slate-400 hover:text-white transition-colors"
              >
                <Phone className="w-4 h-4 text-primary-400 shrink-0" />
                +{contactInfo.whatsapp}
              </a>
            </div>

            {/* Social Media */}
            <div className="flex items-center gap-3 mt-6">
              {settings.socialMedia.map((social) => (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.platform}
                  className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all duration-200"
                >
                  <SocialIcon platform={social.platform} />
                </a>
              ))}
            </div>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Perusahaan
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Produk
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.products.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-slate-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Marketplace Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">
              Marketplace
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.marketplace.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-white transition-colors flex items-center gap-1.5"
                  >
                    {link.label}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <p>{settings.footerText}</p>
          <div className="flex items-center gap-4">
            <Link href="/sitemap.xml" className="hover:text-slate-300 transition-colors">
              Sitemap
            </Link>
            <span>·</span>
            <span>Jakarta Selatan 👶</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
