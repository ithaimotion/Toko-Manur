"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Search, Tag, X, Image as ImageIcon } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { toast } from "sonner";

interface Brand {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  _count: { products: number };
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", slug: "", description: "", image: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Delete state
  const [toDelete, setToDelete] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    try {
      const res = await fetch("/api/brands");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setBrands(data);
    } catch (error: any) {
      toast.error(error.message || "Gagal mengambil data brand");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingId(brand.id);
      setFormData({
        name: brand.name,
        slug: brand.slug,
        description: brand.description || "",
        image: brand.image || "",
      });
    } else {
      setEditingId(null);
      setFormData({ name: "", slug: "", description: "", image: "" });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const url = editingId ? `/api/brands/${editingId}` : "/api/brands";
      const method = editingId ? "PUT" : "POST";
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      toast.success(`Brand berhasil di${editingId ? "perbarui" : "tambahkan"}`);
      setShowModal(false);
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!toDelete) return;
    
    try {
      const res = await fetch(`/api/brands/${toDelete.id}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      toast.success("Brand berhasil dihapus");
      setToDelete(null);
      fetchBrands();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
    }));
  };

  const filtered = brands.filter(b => 
    b.name.toLowerCase().includes(search.toLowerCase()) || 
    b.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Brand Popok"
        description="Kelola daftar brand popok untuk produk Anda"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Merek" }]}
        action={
          <button onClick={() => handleOpenModal()} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Brand
          </button>
        }
      />

      <div className="admin-card p-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Cari brand..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-input pl-9"
          />
        </div>
      </div>

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">Memuat data...</div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-muted-foreground/50" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Belum Ada Brand</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Anda belum menambahkan brand popok apa pun. Tambahkan brand pertama Anda untuk mulai mengelola produk.
            </p>
            <button onClick={() => handleOpenModal()} className="btn-admin-primary inline-flex">
              <Plus className="w-4 h-4" /> Tambah Brand
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Brand</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Slug</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Deskripsi</th>
                  <th className="text-center px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Jumlah Produk</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((brand) => (
                  <tr key={brand.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-muted flex items-center justify-center shrink-0">
                          {brand.image ? (
                            <img src={brand.image} alt={brand.name} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-5 h-5 text-muted-foreground/50" />
                          )}
                        </div>
                        <p className="font-medium text-foreground">{brand.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{brand.slug}</td>
                    <td className="px-5 py-4 text-muted-foreground max-w-[200px] truncate">
                      {brand.description || "-"}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full bg-primary/10 text-primary font-medium text-xs">
                        {brand._count.products}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(brand)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setToDelete({ id: brand.id, name: brand.name })}
                          className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
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
          </div>
        )}
      </div>

      {/* Brand Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />
          <div className="relative bg-card border border-border shadow-xl rounded-xl w-full max-w-lg max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-border shrink-0">
              <h3 className="text-lg font-semibold text-foreground">
                {editingId ? "Edit Brand" : "Tambah Brand Baru"}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Nama Brand *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleNameChange}
                    className="admin-input"
                    placeholder="Contoh: MamyPoko"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData({...formData, slug: e.target.value})}
                    className="admin-input"
                    placeholder="contoh: mamypoko"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Logo/Gambar Brand</label>
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    label="Upload logo brand"
                  />
                  <p className="text-xs text-muted-foreground mt-1.5">Opsional. Logo akan ditampilkan di tabel brand.</p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Deskripsi</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="admin-input resize-none"
                    placeholder="Deskripsi singkat mengenai brand ini..."
                  />
                </div>
              </div>
              
              <div className="flex items-center justify-end gap-3 mt-8">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDeleteModal
        isOpen={!!toDelete}
        onCancel={() => setToDelete(null)}
        onConfirm={handleDelete}
        title="Hapus Brand"
        message={`Apakah Anda yakin ingin menghapus brand "${toDelete?.name}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    </div>
  );
}
