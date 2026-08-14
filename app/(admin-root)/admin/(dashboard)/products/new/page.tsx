"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, ImagePlus, Loader2, Star, Trash2, Plus } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { toast } from "sonner";

export default function NewProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [brands, setBrands] = useState<{id: string, name: string}[]>([]);
  
  const [form, setForm] = useState({
    name: "", slug: "", brandId: "", shortDescription: "",
    description: "", price: "", priceLabel: "Hubungi Kami",
    isFeatured: false, status: "DRAFT" as "DRAFT" | "PUBLISHED",
    specs: [{ label: "", value: "" }],
    marketplaceLinks: [] as { platform: string, url: string }[],
    images: [{ url: "", isPrimary: true }]
  });

  useEffect(() => {
    // Fetch brands for dropdown
    fetch("/api/brands")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setBrands(data);
      })
      .catch(() => toast.error("Gagal mengambil data brand"));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
    if (name === "name") {
      setForm((prev) => ({ 
        ...prev, 
        slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") 
      }));
    }
  };

  const addSpec = () => setForm((p) => ({ ...p, specs: [...p.specs, { label: "", value: "" }] }));
  const removeSpec = (idx: number) => setForm((p) => ({ ...p, specs: p.specs.filter((_, i) => i !== idx) }));
  const updateSpec = (idx: number, field: "label" | "value", val: string) => {
    setForm(p => ({
      ...p,
      specs: p.specs.map((s, i) => i === idx ? { ...s, [field]: val } : s)
    }));
  };

  const addMarketplaceLink = () => setForm((p) => ({ ...p, marketplaceLinks: [...p.marketplaceLinks, { platform: "TOKOPEDIA", url: "" }] }));
  const removeMarketplaceLink = (idx: number) => setForm((p) => ({ ...p, marketplaceLinks: p.marketplaceLinks.filter((_, i) => i !== idx) }));
  const updateMarketplaceLink = (idx: number, field: "platform" | "url", val: string) => {
    setForm(p => ({
      ...p,
      marketplaceLinks: p.marketplaceLinks.map((m, i) => i === idx ? { ...m, [field]: val } : m)
    }));
  };

  const addImage = () => setForm((p) => ({ ...p, images: [...p.images, { url: "", isPrimary: false }] }));
  const removeImage = (idx: number) => setForm((p) => ({ ...p, images: p.images.filter((_, i) => i !== idx) }));
  const updateImage = (idx: number, url: string) => {
    setForm(p => ({
      ...p,
      images: p.images.map((img, i) => i === idx ? { ...img, url } : img)
    }));
  };
  const setPrimaryImage = (idx: number) => {
    setForm(p => ({
      ...p,
      images: p.images.map((img, i) => ({ ...img, isPrimary: i === idx }))
    }));
  };

  const handleSave = async (status: "DRAFT" | "PUBLISHED") => {
    if (!form.name || !form.slug || !form.brandId || !form.images[0].url) {
      toast.error("Nama, Slug, Brand, dan setidaknya 1 Gambar wajib diisi!");
      return;
    }

    setSaving(true);
    
    try {
      const payload = {
        ...form,
        status,
        specs: form.specs.filter(s => s.label && s.value), // Only valid specs
        marketplaceLinks: form.marketplaceLinks.filter(m => m.platform && m.url),
        images: form.images.filter(img => img.url) // Only valid images
      };

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan produk");
      
      toast.success("Produk berhasil disimpan!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tambah Produk Baru"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Produk", href: "/admin/products" }, { label: "Tambah Baru" }]}
        action={
          <div className="flex gap-2">
            <button onClick={() => router.back()} className="btn-admin-secondary">
              <X className="w-4 h-4" /> Batal
            </button>
            <button onClick={() => handleSave("DRAFT")} disabled={saving} className="btn-admin-secondary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Simpan Draft
            </button>
            <button onClick={() => handleSave("PUBLISHED")} disabled={saving} className="btn-admin-primary">
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
                <label className="admin-label">Slug URL <span className="text-destructive">*</span></label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-sm text-muted-foreground">/products/</span>
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="nama-produk" className="admin-input rounded-l-none flex-1" />
                </div>
              </div>
              <div>
                <label className="admin-label">Brand <span className="text-destructive">*</span></label>
                <select name="brandId" value={form.brandId} onChange={handleChange} className="admin-input">
                  <option value="">Pilih brand...</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>{b.name}</option>
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

          {/* Media */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">Gambar Produk <span className="text-destructive">*</span></h2>
              <button type="button" onClick={addImage} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Tambah Gambar
              </button>
            </div>
            
            <div className="space-y-4">
              {form.images.map((img, idx) => (
                <div key={idx} className={`p-4 rounded-lg border ${img.isPrimary ? "border-primary bg-primary/5" : "border-border"}`}>
                  <div className="flex gap-4">
                    <div className="w-24 h-24 rounded-md border border-border bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                      {img.url ? (
                        <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <ImagePlus className="w-6 h-6 text-muted-foreground/50" />
                      )}
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="mb-3">
                        <label className="text-xs font-medium text-muted-foreground mb-1 block">Upload Gambar</label>
                        <ImageUpload
                          value={img.url}
                          onChange={(url) => updateImage(idx, url)}
                          label="Pilih atau geser gambar..."
                        />
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <label className="flex items-center gap-2 text-sm cursor-pointer">
                          <input
                            type="radio"
                            name="primaryImage"
                            checked={img.isPrimary}
                            onChange={() => setPrimaryImage(idx)}
                            className="text-primary focus:ring-primary"
                          />
                          Gambar Utama
                        </label>
                        
                        {form.images.length > 1 && (
                          <button type="button" onClick={() => removeImage(idx)} className="text-destructive text-sm hover:underline flex items-center gap-1">
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Form */}
        <div className="space-y-6">
          {/* Pricing */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Harga</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Harga Spesifik (Rp)</label>
                <input type="number" name="price" value={form.price} onChange={handleChange} placeholder="Contoh: 50000" className="admin-input" />
                <p className="text-xs text-muted-foreground mt-1">Kosongkan jika ingin menggunakan label harga</p>
              </div>
              <div>
                <label className="admin-label">Label Harga Alternatif</label>
                <input type="text" name="priceLabel" value={form.priceLabel} onChange={handleChange} placeholder="Contoh: Hubungi Kami" className="admin-input" />
              </div>
            </div>
          </div>

          {/* Settings */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Pengaturan</h2>
            <div className="space-y-4">
              <label className="flex items-start gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-muted/30 transition-colors">
                <div className="flex items-center h-5">
                  <input type="checkbox" name="isFeatured" checked={form.isFeatured} onChange={handleChange} className="rounded border-input text-primary focus:ring-primary" />
                </div>
                <div>
                  <p className="font-medium text-sm flex items-center gap-1.5">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Produk Unggulan
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">Tampilkan di halaman depan website.</p>
                </div>
              </label>
            </div>
          </div>

          {/* Specifications */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">Spesifikasi</h2>
              <button type="button" onClick={addSpec} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
            
            <div className="space-y-3">
              {form.specs.map((spec, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <input type="text" value={spec.label} onChange={(e) => updateSpec(idx, "label", e.target.value)} placeholder="Nama (Cth: Ukuran)" className="admin-input form-input-sm" />
                    <input type="text" value={spec.value} onChange={(e) => updateSpec(idx, "value", e.target.value)} placeholder="Nilai (Cth: M / L / XL)" className="admin-input form-input-sm" />
                  </div>
                  <button type="button" onClick={() => removeSpec(idx)} className="p-2 mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {form.specs.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada spesifikasi ditambahkan.</p>
              )}
            </div>
          </div>

          {/* Marketplace Links */}
          <div className="admin-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">Link Marketplace</h2>
              <button type="button" onClick={addMarketplaceLink} className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Tambah
              </button>
            </div>
            
            <div className="space-y-3">
              {form.marketplaceLinks.map((link, idx) => (
                <div key={idx} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-2">
                    <select value={link.platform} onChange={(e) => updateMarketplaceLink(idx, "platform", e.target.value)} className="admin-input form-input-sm">
                      <option value="TOKOPEDIA">Tokopedia</option>
                      <option value="SHOPEE">Shopee</option>
                      <option value="LAZADA">Lazada</option>
                      <option value="TIKTOK">TikTok Shop</option>
                      <option value="BLIBLI">Blibli</option>
                    </select>
                    <input type="text" value={link.url} onChange={(e) => updateMarketplaceLink(idx, "url", e.target.value)} placeholder="https://..." className="admin-input form-input-sm" />
                  </div>
                  <button type="button" onClick={() => removeMarketplaceLink(idx)} className="p-2 mt-1 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              
              {form.marketplaceLinks.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Belum ada link marketplace.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
