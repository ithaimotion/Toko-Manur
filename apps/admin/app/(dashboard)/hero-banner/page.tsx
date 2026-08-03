import type { Metadata } from "next";
import Link from "next/link";
import { Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockHeroBanners } from "@toko-manur/mock-data";

export const metadata: Metadata = { title: "Hero Banner" };

export default function AdminHeroBannerPage() {
  return (
    <div>
      <PageHeader
        title="Hero Banner"
        description="Kelola banner utama halaman beranda"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Hero Banner" }]}
        action={
          <button className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Banner
          </button>
        }
      />

      <div className="space-y-4">
        {mockHeroBanners.map((banner, idx) => (
          <div key={banner.id} className="admin-card p-5 flex items-center gap-5">
            <button className="text-muted-foreground cursor-grab">
              <GripVertical className="w-5 h-5" />
            </button>
            <div className="w-24 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
              <img src={banner.image} alt={banner.title} className="object-cover w-full h-full" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">{banner.title}</p>
              <p className="text-sm text-muted-foreground line-clamp-1">{banner.subtitle}</p>
              <div className="flex items-center gap-3 mt-2">
                <span className={`badge-admin ${banner.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                  {banner.isActive ? "Aktif" : "Nonaktif"}
                </span>
                <span className="text-xs text-muted-foreground">Urutan: {banner.order}</span>
                {banner.ctaText && <span className="text-xs text-primary bg-primary-50 px-2 py-0.5 rounded">CTA: {banner.ctaText}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button className="btn-admin-secondary text-xs py-1.5 px-3"><Pencil className="w-3.5 h-3.5" /> Edit</button>
              <button className="p-2 hover:bg-red-50 hover:text-destructive rounded-lg transition-colors text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-5 bg-blue-50 border border-blue-100 rounded-xl">
        <p className="text-sm text-blue-700 font-medium">💡 Tips: Seret dan lepas banner untuk mengubah urutan tampilan. Banner aktif akan ditampilkan dalam mode slideshow di beranda.</p>
      </div>
    </div>
  );
}
