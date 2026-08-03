"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { mockCategories } from "@toko-manur/mock-data";

export default function AdminCategoriesPage() {
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "" });
  const [categories, setCategories] = useState(mockCategories);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value, ...(name === "name" ? { slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "") } : {}) }));
  };

  const handleSave = () => {
    if (!form.name) return;
    if (editId) {
      setCategories((p) => p.map((c) => c.id === editId ? { ...c, ...form } : c));
    } else {
      setCategories((p) => [...p, { id: `cat-${Date.now()}`, ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }]);
    }
    setForm({ name: "", slug: "", description: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: typeof mockCategories[0]) => {
    setForm({ name: cat.name, slug: cat.slug, description: cat.description ?? "" });
    setEditId(cat.id);
    setShowForm(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;
    setCategories((p) => p.filter((c) => c.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Kategori"
        description="Kelola kategori produk"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Kategori" }]}
        action={
          <button onClick={() => { setShowForm(true); setEditId(null); setForm({ name: "", slug: "", description: "" }); }} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Kategori
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        {showForm && (
          <div className="admin-card p-6">
            <h2 className="font-bold text-base mb-5">{editId ? "Edit Kategori" : "Kategori Baru"}</h2>
            <div className="space-y-4">
              <div>
                <label className="admin-label">Nama <span className="text-destructive">*</span></label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Nama kategori" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Slug</label>
                <input name="slug" value={form.slug} onChange={handleChange} placeholder="nama-kategori" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Deskripsi</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Deskripsi singkat..." className="admin-input resize-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={handleSave} className="btn-admin-primary flex-1 justify-center">Simpan</button>
                <button onClick={() => setShowForm(false)} className="btn-admin-secondary">Batal</button>
              </div>
            </div>
          </div>
        )}

        {/* List */}
        <div className={showForm ? "lg:col-span-2" : "lg:col-span-3"}>
          <div className="admin-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Nama</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden md:table-cell">Slug</th>
                  <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider hidden lg:table-cell">Produk</th>
                  <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {categories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{cat.name}</p>
                      {cat.description && <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{cat.description}</p>}
                    </td>
                    <td className="px-5 py-4 text-muted-foreground text-xs font-mono hidden md:table-cell">{cat.slug}</td>
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <span className="badge-admin bg-blue-50 text-blue-600">{cat.productCount ?? 0} produk</span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => handleEdit(cat)} className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteTarget({ id: cat.id, name: cat.name })} className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
