"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, X, ImagePlus, Loader2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockCategories } from "@toko-manur/mock-data";

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "", slug: "", categoryId: "", excerpt: "",
    content: "", seoTitle: "", seoDescription: "",
    status: "draft" as "draft" | "published",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "title" ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""), seoTitle: value } : {}),
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    router.push("/blogs");
  };

  return (
    <div>
      <PageHeader
        title="Tulis Artikel Baru"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Blog", href: "/blogs" }, { label: "Baru" }]}
        action={
          <div className="flex gap-2">
            <button onClick={() => router.back()} className="btn-admin-secondary"><X className="w-4 h-4" /> Batal</button>
            <button onClick={() => { setForm(p => ({ ...p, status: "draft" })); handleSave(); }} disabled={saving} className="btn-admin-secondary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Draft
            </button>
            <button onClick={() => { setForm(p => ({ ...p, status: "published" })); handleSave(); }} disabled={saving} className="btn-admin-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Publikasikan
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Konten Artikel</h2>
            <div className="space-y-5">
              <div>
                <label className="admin-label">Judul Artikel <span className="text-destructive">*</span></label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="Judul artikel yang menarik..." className="admin-input text-lg font-medium" />
              </div>
              <div>
                <label className="admin-label">Slug URL</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-xs text-muted-foreground">/blog/</span>
                  <input name="slug" value={form.slug} onChange={handleChange} placeholder="judul-artikel" className="admin-input rounded-l-none" />
                </div>
              </div>
              <div>
                <label className="admin-label">Ringkasan (Excerpt)</label>
                <textarea name="excerpt" value={form.excerpt} onChange={handleChange} rows={3} placeholder="Ringkasan singkat artikel untuk preview dan SEO..." className="admin-input resize-none" />
              </div>
              <div>
                <label className="admin-label">Konten Artikel</label>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Rich Text Editor</span>
                    <span>(TipTap / Quill akan diintegrasikan di sini)</span>
                  </div>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={16}
                    placeholder="Tulis konten artikel lengkap di sini. Mendukung format HTML..."
                    className="w-full px-4 py-4 text-sm outline-none resize-y font-mono text-slate-700 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-4">Foto Cover</h2>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">Upload gambar cover artikel</p>
              <button type="button" className="btn-admin-secondary text-xs">Pilih Gambar</button>
            </div>
          </div>

          {/* SEO */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">SEO Title</label>
                <input name="seoTitle" value={form.seoTitle} onChange={handleChange} placeholder="Judul untuk mesin pencari" className="admin-input" />
                <p className="text-xs text-muted-foreground mt-1">{form.seoTitle.length}/60 karakter</p>
              </div>
              <div>
                <label className="admin-label">SEO Description</label>
                <textarea name="seoDescription" value={form.seoDescription} onChange={handleChange} rows={3} placeholder="Deskripsi untuk mesin pencari (maks. 160 karakter)" className="admin-input resize-none" maxLength={160} />
                <p className="text-xs text-muted-foreground mt-1">{form.seoDescription.length}/160</p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-4">Pengaturan Artikel</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Kategori</label>
                <select name="categoryId" value={form.categoryId} onChange={handleChange} className="admin-input">
                  <option value="">Pilih kategori...</option>
                  {mockCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select name="status" value={form.status} onChange={handleChange} className="admin-input">
                  <option value="draft">Draft</option>
                  <option value="published">Publikasikan</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
