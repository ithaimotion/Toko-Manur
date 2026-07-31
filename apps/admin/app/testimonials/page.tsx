"use client";

import { useState } from "react";
import Image from "next/image";
import { Plus, Pencil, Trash2, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockTestimonials } from "@toko-manur/mock-data";

export default function AdminTestimonialsPage() {
  const [testimonials, setTestimonials] = useState(mockTestimonials);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerTitle: "", rating: 5, content: "", isActive: true });

  const handleSave = () => {
    const newT = {
      id: `testi-${Date.now()}`,
      customerPhoto: "https://i.pravatar.cc/150",
      ...form,
      createdAt: new Date().toISOString(),
    };
    setTestimonials((p) => [...p, newT]);
    setShowForm(false);
    setForm({ customerName: "", customerTitle: "", rating: 5, content: "", isActive: true });
  };

  const toggleActive = (id: string) =>
    setTestimonials((p) => p.map((t) => t.id === id ? { ...t, isActive: !t.isActive } : t));

  return (
    <div>
      <PageHeader
        title="Testimoni"
        description="Kelola testimoni pelanggan"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Testimoni" }]}
        action={
          <button onClick={() => setShowForm(true)} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Testimoni
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-bold text-base mb-5">Tambah Testimoni Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="admin-label">Nama Pelanggan</label>
              <input value={form.customerName} onChange={(e) => setForm(p => ({ ...p, customerName: e.target.value }))} placeholder="Nama pelanggan" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Jabatan / Asal</label>
              <input value={form.customerTitle} onChange={(e) => setForm(p => ({ ...p, customerTitle: e.target.value }))} placeholder="Petani Sayuran, Jawa Tengah" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} onClick={() => setForm(p => ({ ...p, rating: n }))} className={`w-8 h-8 text-xl transition-all ${n <= form.rating ? "text-amber-400" : "text-slate-200"}`}>★</button>
                ))}
              </div>
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm(p => ({ ...p, isActive: e.target.value === "true" }))} className="admin-input">
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Konten Testimoni</label>
              <textarea value={form.content} onChange={(e) => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Tulis testimoni pelanggan..." className="admin-input resize-none" />
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="btn-admin-primary">Simpan</button>
            <button onClick={() => setShowForm(false)} className="btn-admin-secondary">Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {testimonials.map((t) => (
          <div key={t.id} className={`admin-card p-5 ${!t.isActive ? "opacity-60" : ""}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                {t.customerPhoto && (
                  <Image src={t.customerPhoto} alt={t.customerName} width={40} height={40} className="rounded-full object-cover" />
                )}
                <div>
                  <p className="font-semibold text-sm text-foreground">{t.customerName}</p>
                  {t.customerTitle && <p className="text-xs text-muted-foreground">{t.customerTitle}</p>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleActive(t.id)} className={`p-1.5 rounded-md transition-colors text-xs ${t.isActive ? "text-emerald-600 hover:bg-emerald-50" : "text-muted-foreground hover:bg-muted"}`}>
                  {t.isActive ? "Aktif" : "Nonaktif"}
                </button>
                <button className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
            <div className="flex mb-3">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < t.rating ? "text-amber-400 fill-amber-400" : "text-slate-200"}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">&ldquo;{t.content}&rdquo;</p>
          </div>
        ))}
      </div>
    </div>
  );
}
