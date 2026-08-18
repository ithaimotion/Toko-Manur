"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search, LayoutDashboard, Package, Tag, FileText, Image as ImageIcon,
  Megaphone, ShoppingBag, Building2, Phone, Shield, Bell, Users,
  MessageSquare, ArrowRight, Hash, Command
} from "lucide-react";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  group: string;
  keywords?: string[];
}

const ALL_COMMANDS: CommandItem[] = [
  // Utama
  { id: "dashboard", label: "Dasbor", description: "Halaman utama admin", href: "/admin", icon: LayoutDashboard, group: "Utama", keywords: ["home", "beranda", "utama"] },

  // Konten
  { id: "products", label: "Produk", description: "Kelola produk popok", href: "/admin/products", icon: Package, group: "Konten", keywords: ["popok", "barang"] },
  { id: "brands", label: "Merek", description: "Kelola merek produk", href: "/admin/brands", icon: Tag, group: "Konten", keywords: ["brand", "merk"] },
  { id: "categories", label: "Kategori Blog", description: "Kelola kategori artikel", href: "/admin/categories", icon: Hash, group: "Konten", keywords: ["kategori", "tag"] },
  { id: "blogs", label: "Blog & Artikel", description: "Kelola artikel blog", href: "/admin/blogs", icon: FileText, group: "Konten", keywords: ["artikel", "post", "tulisan"] },
  { id: "reviews", label: "Sinkronisasi Ulasan", description: "Kelola ulasan otomatis", href: "/admin/reviews", icon: MessageSquare, group: "Konten", keywords: ["review", "ulasan", "rating"] },

  // Tampilan
  { id: "hero", label: "Banner Utama", description: "Edit hero banner landing page", href: "/admin/hero-banner", icon: ImageIcon, group: "Tampilan", keywords: ["banner", "hero", "gambar", "foto"] },
  { id: "promo", label: "Promo & Diskon", description: "Kelola promo aktif", href: "/admin/promo", icon: Megaphone, group: "Tampilan", keywords: ["diskon", "sale", "promosi"] },
  { id: "marketplace", label: "Marketplace", description: "Link marketplace eksternal", href: "/admin/marketplace", icon: ShoppingBag, group: "Tampilan", keywords: ["tokopedia", "shopee", "lazada"] },

  // Perusahaan
  { id: "company", label: "Profil Perusahaan", description: "Edit informasi perusahaan", href: "/admin/company-profile", icon: Building2, group: "Perusahaan", keywords: ["profil", "company", "tentang"] },
  { id: "contact", label: "Info Kontak", description: "Kelola data kontak dan pesan", href: "/admin/contact-info", icon: Phone, group: "Perusahaan", keywords: ["kontak", "telepon", "wa", "whatsapp"] },
  { id: "privacy", label: "Kebijakan Privasi", description: "Edit kebijakan privasi", href: "/admin/privacy-policy", icon: Shield, group: "Perusahaan", keywords: ["privasi", "policy"] },
  { id: "terms", label: "Syarat & Ketentuan", description: "Edit syarat dan ketentuan", href: "/admin/terms", icon: FileText, group: "Perusahaan", keywords: ["terms", "syarat", "ketentuan"] },

  // Sistem
  { id: "notifications", label: "Notifikasi", description: "Lihat semua notifikasi", href: "/admin/notifications", icon: Bell, group: "Sistem", keywords: ["notif", "alert"] },
  { id: "users", label: "Pengguna", description: "Kelola akun pengguna admin", href: "/admin/users", icon: Users, group: "Sistem", keywords: ["user", "admin", "akun"] },
];

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const filtered = query.trim()
    ? ALL_COMMANDS.filter((cmd) => {
        const q = query.toLowerCase();
        return (
          cmd.label.toLowerCase().includes(q) ||
          cmd.description?.toLowerCase().includes(q) ||
          cmd.group.toLowerCase().includes(q) ||
          cmd.keywords?.some((k) => k.includes(q))
        );
      })
    : ALL_COMMANDS;

  // Group results
  const grouped = filtered.reduce<Record<string, CommandItem[]>>((acc, item) => {
    if (!acc[item.group]) acc[item.group] = [];
    acc[item.group].push(item);
    return acc;
  }, {});

  const flatFiltered = Object.values(grouped).flat();

  const handleSelect = useCallback(
    (item: CommandItem) => {
      router.push(item.href);
      onClose();
    },
    [router, onClose]
  );

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Scroll active item into view
  useEffect(() => {
    if (!listRef.current) return;
    const activeEl = listRef.current.querySelector(`[data-index="${activeIndex}"]`);
    activeEl?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, flatFiltered.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (flatFiltered[activeIndex]) handleSelect(flatFiltered[activeIndex]);
      } else if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, flatFiltered, activeIndex, handleSelect, onClose]);

  if (!open) return null;

  let globalIdx = 0;

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-start justify-center pt-[12vh] px-4"
      style={{ background: "rgba(0,0,0,0.55)", backdropFilter: "blur(4px)" }}
      onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-xl rounded-2xl overflow-hidden shadow-2xl"
        style={{
          background: "var(--color-surface, #ffffff)",
          border: "1px solid rgba(0,0,0,0.08)",
          boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
        }}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-border">
          <Search className="w-4 h-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Cari halaman atau fitur..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          />
          <kbd className="hidden sm:flex items-center gap-1 px-2 py-1 text-[10px] font-mono text-muted-foreground rounded-md border border-border bg-muted">
            ESC
          </kbd>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          className="overflow-y-auto"
          style={{ maxHeight: "min(420px, 65vh)" }}
        >
          {flatFiltered.length === 0 ? (
            <div className="py-14 text-center">
              <Search className="w-8 h-8 text-muted-foreground/40 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Tidak ada hasil untuk <span className="font-medium text-foreground">"{query}"</span></p>
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group}>
                <div className="px-4 pt-3 pb-1">
                  <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                    {group}
                  </p>
                </div>
                {items.map((item) => {
                  const idx = globalIdx++;
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={item.id}
                      data-index={idx}
                      onMouseEnter={() => setActiveIndex(idx)}
                      onClick={() => handleSelect(item)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${
                        isActive
                          ? "bg-primary/8 text-foreground"
                          : "text-foreground hover:bg-muted/50"
                      }`}
                      style={isActive ? { background: "rgba(207,37,37,0.07)" } : {}}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                          isActive ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <item.icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-tight">{item.label}</p>
                        {item.description && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
                        )}
                      </div>
                      {isActive && (
                        <ArrowRight className="w-3.5 h-3.5 text-primary shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 border-t border-border bg-muted/30 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↑↓</kbd>
              Navigasi
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded border border-border bg-background font-mono text-[10px]">↵</kbd>
              Buka
            </span>
          </div>
          <span className="text-[11px] text-muted-foreground">
            {flatFiltered.length} hasil
          </span>
        </div>
      </div>
    </div>
  );
}
