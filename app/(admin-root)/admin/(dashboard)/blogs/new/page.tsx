"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, X, ImagePlus, Loader2, AlertCircle } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function NewBlogPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    categoryId: "",
    excerpt: "",
    content: "",
    seoTitle: "",
    seoDescription: "",
    status: "draft" as "draft" | "published",
  });

  // Fetch kategori dari database
  useEffect(() => {
    fetch("/api/blog-categories")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setCategories(data);
      })
      .catch(() => {
        // Kategori tidak tersedia, biarkan dropdown kosong
      });
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "title"
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
            seoTitle: value,
          }
        : {}),
    }));
  };

  const handleSave = async (status: "draft" | "published") => {
    if (!form.title.trim()) {
      setError("Judul artikel wajib diisi");
      return;
    }
    if (!form.content.trim()) {
      setError("Konten artikel wajib diisi");
      return;
    }

    setError(null);
    setSaving(true);

    try {
      const payload = {
        ...form,
        status,
        slug: form.slug || form.title.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
      };

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan artikel");
      }

      router.push("/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan, coba lagi");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tulis Artikel Baru"
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blog", href: "/admin/blogs" },
          { label: "Baru" },
        ]}
        action={
          <div className="flex gap-2">
            <button
              onClick={() => router.back()}
              disabled={saving}
              className="btn-admin-secondary"
            >
              <X className="w-4 h-4" /> Batal
            </button>
            <button
              onClick={() => handleSave("draft")}
              disabled={saving}
              className="btn-admin-secondary"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              Simpan Draft
            </button>
            <button
              onClick={() => handleSave("published")}
              disabled={saving}
              className="btn-admin-primary"
            >
              {saving ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}{" "}
              Publikasikan
            </button>
          </div>
        }
      />

      {/* Error Alert */}
      {error && (
        <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button
            onClick={() => setError(null)}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="lg:col-span-2 space-y-6">
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">Konten Artikel</h2>
            <div className="space-y-5">
              <div>
                <label className="admin-label">
                  Judul Artikel <span className="text-destructive">*</span>
                </label>
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Judul artikel yang menarik..."
                  className="admin-input text-lg font-medium"
                />
              </div>
              <div>
                <label className="admin-label">Slug URL</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-xs text-muted-foreground">
                    /blog/
                  </span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="judul-artikel"
                    className="admin-input rounded-l-none"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Ringkasan (Excerpt)</label>
                <textarea
                  name="excerpt"
                  value={form.excerpt}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Ringkasan singkat artikel untuk preview dan SEO..."
                  className="admin-input resize-none"
                />
              </div>
              <div>
                <label className="admin-label">
                  Konten Artikel <span className="text-destructive">*</span>
                </label>
                <div className="border border-border rounded-xl overflow-hidden">
                  <div className="bg-muted px-4 py-2 border-b border-border flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-semibold">Editor Konten</span>
                    <span>· Mendukung HTML</span>
                  </div>
                  <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    rows={18}
                    placeholder="Tulis konten artikel lengkap di sini..."
                    className="w-full px-4 py-4 text-sm outline-none resize-y font-mono text-slate-700 leading-relaxed"
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {form.content.length} karakter · Estimasi {Math.max(1, Math.ceil(form.content.length / 1000))} menit baca
                </p>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-4">Foto Cover</h2>
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:border-primary transition-colors cursor-pointer">
              <ImagePlus className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-3">Upload gambar cover artikel</p>
              <button type="button" className="btn-admin-secondary text-xs">
                Pilih Gambar
              </button>
            </div>
          </div>

          {/* SEO */}
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">SEO</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">SEO Title</label>
                <input
                  name="seoTitle"
                  value={form.seoTitle}
                  onChange={handleChange}
                  placeholder="Judul untuk mesin pencari"
                  className="admin-input"
                />
                <p className={`text-xs mt-1 ${form.seoTitle.length > 60 ? "text-destructive" : "text-muted-foreground"}`}>
                  {form.seoTitle.length}/60 karakter
                </p>
              </div>
              <div>
                <label className="admin-label">SEO Description</label>
                <textarea
                  name="seoDescription"
                  value={form.seoDescription}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Deskripsi untuk mesin pencari (maks. 160 karakter)"
                  className="admin-input resize-none"
                  maxLength={160}
                />
                <p className={`text-xs mt-1 ${form.seoDescription.length > 150 ? "text-amber-500" : "text-muted-foreground"}`}>
                  {form.seoDescription.length}/160
                </p>
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
                <select
                  name="categoryId"
                  value={form.categoryId}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="">Tanpa kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                {categories.length === 0 && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Belum ada kategori tersedia
                  </p>
                )}
              </div>
              <div>
                <label className="admin-label">Status Awal</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Langsung Publik</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview info */}
          <div className="admin-card p-5 bg-muted/40">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Preview Info</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Panjang konten</span>
                <span className="font-medium">{form.content.length} char</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. baca</span>
                <span className="font-medium">{Math.max(1, Math.ceil(form.content.length / 1000))} menit</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Status</span>
                <span className={`font-medium ${form.status === "published" ? "text-emerald-600" : "text-amber-600"}`}>
                  {form.status === "published" ? "Akan dipublikasikan" : "Akan disimpan draft"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
