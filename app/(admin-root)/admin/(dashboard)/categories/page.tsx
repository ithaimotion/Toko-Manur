"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, Tag, Loader2, X, Save, AlertCircle, Check } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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
  const queryClient = useQueryClient();
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

  const { data: categories = [], isLoading } = useQuery<BlogCategory[]>({
    queryKey: ["adminCategories"],
    queryFn: async () => {
      const res = await fetch("/api/blog-categories");
      if (!res.ok) throw new Error("Gagal memuat kategori");
      const data = await res.json();
      return data;
    },
  });

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

  const saveMutation = useMutation({
    mutationFn: async (data: typeof form) => {
      const url = editTarget ? `/api/blog-categories/${editTarget.id}` : "/api/blog-categories";
      const method = editTarget ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const resData = await res.json();
      if (!res.ok) throw new Error(resData.error || "Gagal menyimpan kategori");
      return resData;
    },
    onSuccess: () => {
      showToast(`Kategori berhasil di${editTarget ? "perbarui" : "tambahkan"}`, "success");
      closeForm();
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: any) => {
      setFormError(error.message);
    }
  });

  const handleSave = () => {
    if (!form.name.trim()) {
      setFormError("Nama kategori wajib diisi");
      return;
    }
    if (!form.slug.trim()) {
      setFormError("Slug wajib diisi");
      return;
    }
    saveMutation.mutate(form);
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/blog-categories/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      return data;
    },
    onSuccess: () => {
      showToast("Kategori berhasil dihapus", "success");
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["adminCategories"] });
    },
    onError: (error: any) => {
      showToast(error.message || "Gagal menghapus kategori", "error");
    }
  });

  const handleDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
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
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Kategori" }]}
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
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={closeForm} className="btn-admin-secondary">
                    Batal
                  </button>
                  <button type="submit" onClick={handleSave} disabled={saveMutation.isPending} className="btn-admin-primary min-w-[120px] justify-center">
                    {saveMutation.isPending ? (
                      <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Menyimpan</>
                    ) : (
                      <><Save className="w-4 h-4 mr-2" /> Simpan</>
                    )}
                  </button>
                </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
        {isLoading ? (
          <div className="mt-6">
            <TableSkeleton columns={5} rows={3} showActions={false} />
          </div>
        ) : categories.length === 0 ? (
          <div className="admin-card mt-6 p-12 flex flex-col items-center text-center">
            <Tag className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="font-semibold text-lg mb-1">Belum ada Kategori</h3>
            <p className="text-muted-foreground text-sm max-w-sm mb-6">
              Buat kategori pertama Anda untuk mulai mengelompokkan artikel.
            </p>
            <button onClick={openCreateForm} className="btn-admin-primary">
              <Plus className="w-4 h-4 mr-2" /> Buat Kategori Baru
            </button>
          </div>
        ) : (
          <div className="admin-card overflow-hidden mt-6">
            <div className="overflow-x-auto">
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
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        loading={deleteMutation.isPending}
        onConfirm={handleDelete}
        onCancel={() => !deleteMutation.isPending && setDeleteTarget(null)}
      />
    </div>
  );
}
