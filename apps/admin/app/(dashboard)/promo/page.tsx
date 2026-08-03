"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Megaphone } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockPromos } from "@toko-manur/mock-data";
import type { Promo } from "@toko-manur/types";
import { formatDate } from "@toko-manur/utils";

interface PromoFormState {
  title: string;
  description: string;
  code: string;
  discount: string;
  validUntil: string;
  isActive: boolean;
}

export default function AdminPromoPage() {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<PromoFormState>({
    title: "", description: "", code: "", discount: "",
    validUntil: "", isActive: true,
  });
  const [promos, setPromos] = useState<Promo[]>(mockPromos);

  const handleSave = () => {
    const newPromo: Promo = {
      id: `promo-${Date.now()}`,
      title: form.title,
      description: form.description,
      subtitle: form.code || undefined,
      badgeText: form.discount || undefined,
      isActive: form.isActive,
      order: promos.length + 1,
      validUntil: form.validUntil || undefined,
      createdAt: new Date().toISOString(),
    };
    setPromos((p) => [...p, newPromo]);
    setShowForm(false);
    setForm({ title: "", description: "", code: "", discount: "", validUntil: "", isActive: true });
  };

  return (
    <div>
      <PageHeader
        title="Promo & Diskon"
        description="Kelola banner promo dan kode diskon"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Promo" }]}
        action={
          <button onClick={() => setShowForm(true)} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Promo
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-bold text-base mb-5">Tambah Promo Baru</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="admin-label">Judul Promo</label>
              <input value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Cth: Promo Kemerdekaan" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Kode Voucher (Opsional)</label>
              <input value={form.code} onChange={(e) => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="Cth: MERDEKA45" className="admin-input uppercase" />
            </div>
            <div>
              <label className="admin-label">Deskripsi Diskon</label>
              <input value={form.discount} onChange={(e) => setForm(p => ({ ...p, discount: e.target.value }))} placeholder="Cth: Diskon s/d 45%" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Berlaku Sampai</label>
              <input type="date" value={form.validUntil} onChange={(e) => setForm(p => ({ ...p, validUntil: e.target.value }))} className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Deskripsi Tambahan</label>
              <textarea value={form.description} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} rows={2} className="admin-input resize-none" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} className="btn-admin-primary">Simpan</button>
            <button onClick={() => setShowForm(false)} className="btn-admin-secondary">Batal</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {promos.map((promo) => (
          <div key={promo.id} className={`admin-card p-5 border-l-4 ${promo.isActive ? "border-l-primary" : "border-l-muted opacity-60"}`}>
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-bold text-lg text-foreground">{promo.title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{promo.description}</p>
              </div>
              <div className="flex items-center gap-1">
                <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                <button className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3 mt-4 pt-4 border-t border-border">
              {promo.badgeText && (
                <span className="badge-admin bg-rose-100 text-rose-700">{promo.badgeText}</span>
              )}
              {promo.subtitle && (
                <span className="px-2 py-1 bg-muted font-mono text-xs font-semibold rounded">{promo.subtitle}</span>
              )}
              <span className="text-xs text-muted-foreground ml-auto">
                Valid s/d {formatDate(promo.validUntil)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
