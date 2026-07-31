"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, ImagePlus, Loader2, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockCategories } from "@toko-manur/mock-data";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    name: "", slug: "", categoryId: "", shortDescription: "",
    description: "", price: "", priceLabel: "Hubungi Kami",
    isFeatured: false, status: "draft" as "draft" | "published",
    specs: [{ label: "", value: "" }],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "name") {
      setForm((prev) => ({ ...prev, slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") }));
    }
  };

  const addSpec = () => setForm((p) => ({ ...p, specs: [...p.specs, { label: "", value: "" }] }));
  const removeSpec = (idx: number) => setForm((p) => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));

  const handleSave = async (status: "draft" | "published") => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    router.push("/products");
  };

  return (
    <div>
      <PageHeader
        title="Tambah Produk Baru"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Produk", href: "/products" }, { label: "Tambah Baru" }]}
        action={
          <div className="flex gap-2">
            <button onClick={() => router.back()} className="btn-admin-secondary">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={() => handleSave("draft")} disabled={saving} className="btn-admin-secondary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Draft
            </button>
            <button onClick={() => handleSave("published")} disabled={saving} className="btn-admin-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Publikasikan
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Informasi Dasar</h2>
            <div className="space-y-5">
              <div>
                <label className="admin-label">Nama Produk <span className="text-destructive">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Masukkan nama produk" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Slug URL</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-sm text-muted-foreground">/products/</span>
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="nama-produk" className="admin-input rounded-l-none flex-1" />
                </div>
              </div>
              <div>
                <label className="admin-label">Kategori <span className="text-destructive">*</span></label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="admin-input">
                  <option value="">Pilih kategori...</option>
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Deskripsi Singkat</label>
                <textarea name="shortDescription" value={form.shortDescription} onChange={handleChange} rows={2} placeholder="Deskripsi singkat produk (maks. 160 karakter)" className="admin-input resize-none" maxLength={160} />
                <p className="text-xs text-muted-foreground mt-1">{form.shortDescription.length}/160</p>
              </div>
              <div>
                <label className="admin-label">Deskripsi Lengkap</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={6} placeholder="Deskripsi lengkap produk..." className="admin-input resize-y" />
              </div>
            </div>
          </div>

          {/* Specifications */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">Spesifikasi</h2>
              <button onClick={addSpec} type="button" className="btn-admin-secondary text-xs">
                + Tambah Baris
              </button>
            </div>
            <div className="space-y-3">
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-3 items-center">
                  <input
                    value={spec.label}
                    onChange={(e) => setForm((p) => ({ ...p, specs: p.specs.map((s, i) => i === idx ? { ...s, label: e.target.value } : s) }))}
                    placeholder="Label (cth: Berat)"
                    className="admin-input flex-1"
                  />
                  <input
                    value={spec.value}
                    onChange={(e) => setForm((p) => ({ ...p, specs: p.specs.map((s, i) => i === idx ? { ...s, value: e.target.value } : s) }))}
                    placeholder="Nilai (cth: 25 kg)"
                    className="admin-input flex-1"
                  />
                  <button onClick={() => removeSpec(idx)} className="p-2 text-destructive hover:bg-red-50 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Image Upload */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Foto Produk</h2>
            <div className="border-2 border-dashed border-border rounded-xl p-10 text-center hover:border-primary transition-colors cursor-pointer">
              <ImagePlus className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-sm font-medium text-foreground mb-1">Klik atau seret gambar ke sini</p>
              <p className="text-xs text-muted-foreground">PNG, JPG, WEBP maks. 5MB. Upload beberapa gambar.</p>
              <button type="button" className="btn-admin-secondary mt-4 text-xs">
                Pilih Gambar
              </button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-4">Publikasi</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="admin-input">
                  <option value="draft">Draft</option>
                  <option value="published">Aktif / Publish</option>
                </select>
              </div>
              <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100">
                <Star className="w-4 h-4 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">Produk Unggulan</p>
                  <p className="text-xs text-muted-foreground">Tampilkan di halaman utama</p>
                </div>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={form.isFeatured}
                  onChange={handleChange}
                  className="w-4 h-4 accent-primary"
                />
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-4">Harga</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Harga (Rp)</label>
                <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="0 (kosongkan jika tidak ada)" className="admin-input" />
                <p className="text-xs text-muted-foreground mt-1">Biarkan kosong untuk tampilkan label teks</p>
              </div>
              <div>
                <label className="admin-label">Label Harga (jika tanpa harga)</label>
                <input name="priceLabel" value={form.priceLabel} onChange={handleChange} placeholder="Hubungi Kami" className="admin-input" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
