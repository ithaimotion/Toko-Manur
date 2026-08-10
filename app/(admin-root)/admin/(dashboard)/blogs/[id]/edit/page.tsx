"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Save, X, ImagePlus, Loader2, AlertCircle, Trash2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
}

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [blogTitle, setBlogTitle] = useState("");

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

  // Fetch blog data & kategori
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogRes, catsRes] = await Promise.all([
          fetch(`/api/blogs/${id}`),
          fetch("/api/blog-categories"),
        ]);

        if (!blogRes.ok) {
          throw new Error("Blog tidak ditemukan");
        }

        const blog = await blogRes.json();
        const cats = await catsRes.json();

        setBlogTitle(blog.title);
        setForm({
          title: blog.title,
          slug: blog.slug,
          categoryId: blog.categoryId ?? "",
          excerpt: blog.excerpt ?? "",
          content: blog.content,
          seoTitle: blog.seoTitle ?? "",
          seoDescription: blog.seoDescription ?? "",
          status: blog.status === "PUBLISHED" ? "published" : "draft",
        });

        if (Array.isArray(cats)) setCategories(cats);
      } catch (err: any) {
        setError(err.message || "Gagal memuat data artikel");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
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
      const res = await fetch(`/api/blogs/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, status }),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan perubahan");
      }

      router.push("/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan, coba lagi");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/blogs/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Gagal menghapus artikel");
      }
      router.push("/blogs");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat menghapus");
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-muted-foreground">
        <Loader2 className="w-8 h-8 animate-spin" />
        <p className="text-sm">Memuat artikel...</p>
      </div>
    );
  }

  if (error && !form.title) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <AlertCircle className="w-10 h-10 text-destructive" />
        <p className="text-muted-foreground text-sm">{error}</p>
        <Link href="/blogs" className="btn-admin-secondary">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Edit Artikel"
        description={blogTitle}
        breadcrumb={[
          { label: "Dashboard", href: "/admin" },
          { label: "Blog", href: "/admin/blogs" },
          { label: "Edit" },
        ]}
        action={
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => router.back()}
              disabled={saving}
              className="btn-admin-secondary"
            >
              <X className="w-4 h-4" /> Batal
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              disabled={saving}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border border-red-200 text-destructive hover:bg-red-50 transition-all disabled:opacity-60"
            >
              <Trash2 className="w-4 h-4" /> Hapus
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
              {form.status === "published" ? "Perbarui" : "Publikasikan"}
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
                  placeholder="Ringkasan singkat artikel..."
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
              </div>
              <div>
                <label className="admin-label">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="admin-input"
                >
                  <option value="draft">Draft</option>
                  <option value="published">Aktif / Publik</option>
                </select>
              </div>
            </div>
          </div>

          {/* Preview info */}
          <div className="admin-card p-5 bg-muted/40">
            <h3 className="font-semibold text-sm mb-3 text-muted-foreground uppercase tracking-wide">Info Artikel</h3>
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
                  {form.status === "published" ? "Aktif" : "Draft"}
                </span>
              </div>
            </div>
          </div>

          {/* Danger zone */}
          <div className="admin-card p-5 border border-red-100">
            <h3 className="font-semibold text-sm mb-3 text-destructive uppercase tracking-wide">Zona Berbahaya</h3>
            <p className="text-xs text-muted-foreground mb-3">
              Menghapus artikel bersifat permanen dan tidak bisa dibatalkan.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 text-sm font-medium text-destructive border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
              <Trash2 className="w-4 h-4" /> Hapus Artikel Ini
            </button>
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={showDeleteModal}
        itemName={blogTitle}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setShowDeleteModal(false)}
      />
    </div>
  );
}
