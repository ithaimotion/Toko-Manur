"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Tag, Loader2, X, Save, AlertCircle, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";

interface BlogCategory {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  createdAt: string;
  updatedAt: string;
}

const emptyForm = { name: "", slug: "", description: "" };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<BlogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editTarget, setEditTarget] = useState<BlogCategory | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState<string | null>(null);

  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/blog-categories");
      if (!res.ok) throw new Error();
      const data = await res.json();
      setCategories(data);
    } catch {
      showToast("Gagal memuat kategori", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({
      ...p,
      [name]: value,
      ...(name === "name"
        ? {
            slug: value
              .toLowerCase()
              .replace(/\s+/g, "-")
              .replace(/[^a-z0-9-]/g, ""),
          }
        : {}),
    }));
  };

  const openCreateForm = () => {
    setForm(emptyForm);
    setEditTarget(null);
    setFormError(null);
    setShowForm(true);
  };

  const openEditForm = (cat: BlogCategory) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "" });
    setEditTarget(cat);
    setFormError(null);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditTarget(null);
    setForm(emptyForm);
    setFormError(null);
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      setFormError("Nama kategori wajib diisi");
      return;
    }
    if (!form.slug.trim()) {
      setFormError("Slug wajib diisi");
      return;
    }

    setFormError(null);
    setSaving(true);

    try {
      const isEdit = !!editTarget;
      const url = isEdit ? `/api/blog-categories/${editTarget!.id}` : "/api/blog-categories";
      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Gagal menyimpan");
      }

      showToast(
        isEdit ? `Kategori "${form.name}" berhasil diperbarui` : `Kategori "${form.name}" berhasil dibuat`,
        "success"
      );
      closeForm();
      fetchCategories();
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/blog-categories/${deleteTarget.id}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Gagal menghapus");
      showToast(`Kategori "${deleteTarget.name}" berhasil dihapus`, "success");
      setDeleteTarget(null);
      fetchCategories();
    } catch (err: any) {
      showToast(err.message || "Terjadi kesalahan saat menghapus", "error");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-2 px-5 py-3 rounded-xl shadow-lg text-sm font-medium transition-all ${
            toast.type === "success" ? "bg-emerald-500 text-white" : "bg-destructive text-white"
          }`}
        >
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      <PageHeader
        title="Kategori Blog"
        description="Kelola kategori untuk artikel blog"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Kategori" }]}
        action={
          <button onClick={openCreateForm} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form Panel */}
        {showForm && (
          <div className="admin-card p-6 h-fit">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-base">
                {editTarget ? "Edit Kategori" : "Kategori Baru"}
              </h2>
              <button
                onClick={closeForm}
                className="p-1.5 hover:bg-muted rounded-lg text-muted-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form Error */}
            {formError && (
              <div className="mb-4 flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {formError}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="admin-label">
                  Nama <span className="text-destructive">*</span>
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Nama kategori"
                  className="admin-input"
                  autoFocus
                />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <div className="flex items-center">
                  <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-xs text-muted-foreground">
                    /blog/
                  </span>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    placeholder="nama-kategori"
                    className="admin-input rounded-l-none font-mono text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="admin-label">Deskripsi</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Deskripsi singkat kategori..."
                  className="admin-input resize-none"
                />
              </div>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="btn-admin-primary flex-1 justify-center"
                >
                  {saving ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {editTarget ? "Perbarui" : "Simpan"}
                </button>
                <button onClick={closeForm} disabled={saving} className="btn-admin-secondary">
                  Batal
                </button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="admin-card overflow-hidden">
            {loading ? (
              <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
                <Loader2 className="w-7 h-7 animate-spin" />
                <p className="text-sm">Memuat kategori...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="py-20 flex flex-col items-center gap-3 text-muted-foreground">
                <Tag className="w-10 h-10" />
                <p className="text-sm font-medium">Belum ada kategori</p>
                <p className="text-xs text-center max-w-xs">
                  Buat kategori untuk mengelompokkan artikel blog kamu
                </p>
                <button onClick={openCreateForm} className="btn-admin-primary mt-1 text-xs">
                  <Plus className="w-3.5 h-3.5" /> Buat Kategori Pertama
                </button>
              </div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Nama
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">
                        Slug
                      </th>
                      <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">
                        Deskripsi
                      </th>
                      <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">
                        Aksi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {categories.map((cat) => (
                      <tr
                        key={cat.id}
                        className={`hover:bg-muted/30 transition-colors ${
                          editTarget?.id === cat.id ? "bg-primary/5 border-l-2 border-l-primary" : ""
                        }`}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                              <Tag className="w-4 h-4 text-primary" />
                            </div>
                            <div>
                              <p className="font-medium text-foreground">{cat.name}</p>
                              <p className="text-xs text-muted-foreground md:hidden font-mono mt-0.5">
                                {cat.slug}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-muted-foreground text-xs font-mono hidden md:table-cell">
                          {cat.slug}
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          {cat.description ? (
                            <p className="text-muted-foreground text-sm line-clamp-1">
                              {cat.description}
                            </p>
                          ) : (
                            <span className="text-muted-foreground text-xs">—</span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => openEditForm(cat)}
                              className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground"
                              title="Edit"
                            >
                              <Pencil className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })}
                              className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="px-5 py-3 border-t border-border bg-muted/30">
                  <p className="text-xs text-muted-foreground">
                    Total {categories.length} kategori
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        loading={deleting}
        onConfirm={handleDelete}
        onCancel={() => !deleting && setDeleteTarget(null)}
      />
    </div>
  );
}
