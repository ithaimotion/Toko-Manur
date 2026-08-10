import Link from "next/link";
import {
  Instagram,
  Youtube,
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
    { label: "About", href: "/about" },
    { label: "Industries", href: "/industries" },
    { label: "Product", href: "/products" },
    { label: "Categories", href: "/categories" },
  ],
  shop: [
    { label: "Jacket", href: "/products?category=jacket" },
    { label: "Torebag", href: "/products?category=torebag" },
    { label: "Hat", href: "/products?category=hat" },
    { label: "Blouse", href: "/products?category=blouse" },
  ],
  cart: [
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Terms", href: "/terms" },
    { label: "Tutorials", href: "/tutorials" },
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
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white transition-all duration-300"
              >
                <Instagram className="w-5 h-5" strokeWidth={1.5} />
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white active:bg-[#78a4cb] active:text-white focus-visible:bg-[#78a4cb] focus-visible:text-white transition-all duration-300"
              >
                {/* Custom X Icon */}
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 4l16 16m0-16L4 20" />
                </svg>
              </a>
              <a
                href="#"
                className="w-12 h-12 rounded-full border border-[#c7dce7] flex items-center justify-center text-[#78a4cb] hover:bg-[#78a4cb] hover:text-white active:bg-[#78a4cb] active:text-white focus-visible:bg-[#78a4cb] focus-visible:text-white transition-all duration-300"
              >
                <Youtube className="w-5 h-5" strokeWidth={1.5} />
              </a>
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
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16 lg:gap-28 w-full lg:w-auto">
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
                SHOP
              </h4>
              <ul className="space-y-4">
                {footerLinks.shop.map((link) => (
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
                CART
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
          {/* Get Started Button placed over the line */}
          <div className="absolute right-0 -top-5">
            <Link 
              href="/contact" 
              className="bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary-700 transition-colors"
            >
              Get Started
            </Link>
          </div>

          <p className="text-sm text-[#6f6972] max-w-md leading-relaxed">
            From branding to digital marketing. Our expert<br />
            team is here to elevate your brand and connect you<br />
            with your audience
          </p>

          <div className="flex gap-8 text-sm text-[#6f6972] font-medium tracking-wide">
            <Link href="/terms" className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors uppercase">
              TERMS & CONDITIONS
            </Link>
            <Link href="/privacy" className="hover:text-[#78a4cb] active:text-[#78a4cb] focus-visible:text-[#78a4cb] transition-colors uppercase">
              PRIVACY POLICY
            </Link>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-4 left-0 w-full overflow-hidden pointer-events-none select-none text-center flex justify-center">
        <h1 className="text-[15vw] sm:text-[13vw] md:text-[11vw] lg:text-[10vw] xl:text-[9.5vw] leading-[0.75] font-bold text-[#e8dce7] whitespace-nowrap tracking-tighter">
          Toko-Manur
        </h1>
      </div>
    </footer>
  );
}

