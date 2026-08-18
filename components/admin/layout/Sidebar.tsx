"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Package, Tag, FileText, Star, Image as ImageIcon, Megaphone,
  ShoppingBag, Building2, Phone, Users, Settings, Baby, ChevronLeft,
  ChevronRight, ExternalLink, Key, MessageSquare, Shield
} from "lucide-react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const navSections: { title: string; items: NavItem[] }[] = [
  {
    title: "Utama",
    items: [
      { label: "Dasbor", href: "/admin", icon: LayoutDashboard },
    ],
  },
  {
    title: "Konten",
    items: [
      { label: "Produk", href: "/admin/products", icon: Package, badge: 8 },
      { label: "Merek", href: "/admin/brands", icon: Tag },
      { label: "Kategori Blog", href: "/admin/categories", icon: Tag },
      { label: "Blog", href: "/admin/blogs", icon: FileText, badge: 6 },
      { label: "Sinkronisasi Ulasan", href: "/admin/reviews", icon: MessageSquare },
    ],
  },
  {
    title: "Tampilan",
    items: [
      { label: "Banner Utama", href: "/admin/hero-banner", icon: ImageIcon },
      { label: "Promo", href: "/admin/promo", icon: Megaphone },
      { label: "Marketplace", href: "/admin/marketplace", icon: ShoppingBag },
    ],
  },
  {
    title: "Perusahaan",
    items: [
      { label: "Profil Perusahaan", href: "/admin/company-profile", icon: Building2 },
      { label: "Info Kontak", href: "/admin/contact-info", icon: Phone },
      { label: "Kebijakan Privasi", href: "/admin/privacy-policy", icon: Shield },
      { label: "Syarat & Ketentuan", href: "/admin/terms", icon: FileText },
    ],
  },
  {
    title: "Sistem",
    items: [
      { label: "Pengguna", href: "/admin/users", icon: Users },
    ],
  },
];

interface SidebarProps {
  productCount?: number;
  blogCount?: number;
  categoryCount?: number;
  brandCount?: number;
}

export function Sidebar({ productCount = 0, blogCount = 0, categoryCount = 0, brandCount = 0 }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Inject dynamic counts
  const navSectionsWithCounts = navSections.map(section => ({
    ...section,
    items: section.items.map(item => {
      if (item.label === "Produk") return { ...item, badge: productCount };
      if (item.label === "Blog") return { ...item, badge: blogCount };
      if (item.label === "Kategori Blog") return { ...item, badge: categoryCount };
      if (item.label === "Merek") return { ...item, badge: brandCount };
      return item;
    })
  }));

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    
    // Temukan semua href (selain "/admin") yang cocok dengan pathname
    const allHrefs = navSections.flatMap(s => s.items.map(i => i.href)).filter(h => h !== "/admin");
    const matchedHrefs = allHrefs.filter(h => pathname === h || pathname.startsWith(`${h}/`));
    
    if (matchedHrefs.length > 0) {
      // Cari href yang paling spesifik (paling panjang)
      const longestMatch = matchedHrefs.reduce((a, b) => a.length > b.length ? a : b);
      return href === longestMatch;
    }
    
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <aside
      className={`bg-sidebar flex flex-col h-full transition-all duration-300 shrink-0 ${
        collapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-sidebar-border px-4 ${collapsed ? "justify-center" : "gap-3"}`}>
        <div className="w-8 h-8 relative rounded-lg overflow-hidden shrink-0">
          <Image src="/logo-manur.png" alt="Toko Manur Logo" fill className="object-contain" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-[#2f2a33] font-bold text-sm">Toko Manur Baby</p>
            <p className="text-[#7c6d7e] text-xs">Admin Panel</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-4 scrollbar-thin px-3">
        {navSectionsWithCounts.map((section) => (
          <div key={section.title} className="mb-6">
            {!collapsed && (
              <p className="text-xs font-semibold text-[#8a7d8d] uppercase tracking-wider px-3 mb-2">
                {section.title}
              </p>
            )}
            <div className="space-y-1">
              {section.items.map(({ label, href, icon: Icon, badge }) => (
                <Link
                  key={href}
                  href={href}
                  title={collapsed ? label : undefined}
                  className={`${
                    isActive(href) ? "sidebar-link-active" : "sidebar-link"
                  } ${collapsed ? "justify-center px-0" : ""}`}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{label}</span>
                      {badge !== undefined && badge > 0 && (
                        <span className="ml-auto bg-[#78a4cb] text-white text-[10px] font-bold rounded-full min-w-[20px] h-5 px-1.5 flex items-center justify-center shrink-0 shadow-sm">
                          {badge}
                        </span>
                      )}
                    </>
                  )}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* View Site */}
      {!collapsed && (
        <div className="px-3 py-3 border-t border-sidebar-border">
          <a
            href="http://localhost:3000"
            target="_blank"
            rel="noopener noreferrer"
            className="sidebar-link text-xs opacity-70 hover:opacity-100"
          >
            <ExternalLink className="w-4 h-4" />
            Lihat Website
          </a>
        </div>
      )}

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center h-10 border-t border-sidebar-border text-[#8a7d8d] hover:text-[#78a4cb] transition-colors"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
      </button>
    </aside>
  );
}
