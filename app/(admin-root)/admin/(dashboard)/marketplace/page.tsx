"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import type { MarketplacePlatform } from "@/lib/types";
import { 
  getMarketplaceLinks, 
  createMarketplaceLink, 
  updateMarketplaceLink, 
  deleteMarketplaceLink 
} from "@/lib/actions/marketplace-links";

type MarketplaceLink = {
  id: string;
  platform: string;
  name: string;
  url: string;
  description: string | null;
  isActive: boolean;
  order: number;
};

export default function AdminMarketplacePage() {
  const [links, setLinks] = useState<MarketplaceLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [form, setForm] = useState<Omit<MarketplaceLink, "id">>({ 
    name: "", platform: "custom", url: "", description: "", order: 0, isActive: true 
  });
  const [editId, setEditId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  const platforms = [
    { value: "shopee", label: "Shopee" },
    { value: "tokopedia", label: "Tokopedia" },
    { value: "tiktok", label: "TikTok Shop" },
    { value: "lazada", label: "Lazada" },
    { value: "custom", label: "Lainnya" },
  ];

  useEffect(() => {
    loadLinks();
  }, []);

  const loadLinks = async () => {
    setLoading(true);
    const res = await getMarketplaceLinks();
    if (res.success && res.data) {
      setLinks(res.data);
    } else {
      toast.error(res.error || "Gagal memuat link");
    }
    setLoading(false);
  };

  const handleEdit = (link: MarketplaceLink) => {
    setForm({
      name: link.name,
      platform: link.platform,
      url: link.url,
      description: link.description || "",
      order: link.order,
      isActive: link.isActive
    });
    setEditId(link.id);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setForm({ name: "", platform: "custom", url: "", description: "", order: 0, isActive: true });
    setEditId(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setSaving(true);
    if (editId) {
      const res = await updateMarketplaceLink(editId, form);
      if (res.success) {
        toast.success("Link berhasil diupdate!");
        setShowForm(false);
        loadLinks();
      } else {
        toast.error(res.error || "Gagal update link");
      }
    } else {
      const res = await createMarketplaceLink(form);
      if (res.success) {
        toast.success("Link berhasil ditambahkan!");
        setShowForm(false);
        loadLinks();
      } else {
        toast.error(res.error || "Gagal menambah link");
      }
    }
    setSaving(false);
  };

  const toggleActive = async (link: MarketplaceLink) => {
    const res = await updateMarketplaceLink(link.id, { isActive: !link.isActive });
    if (res.success) {
      toast.success(`Status ${link.name} diubah!`);
      loadLinks();
    } else {
      toast.error(res.error || "Gagal mengubah status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await deleteMarketplaceLink(deleteTarget.id);
    if (res.success) {
      toast.success("Link berhasil dihapus!");
      loadLinks();
    } else {
      toast.error(res.error || "Gagal menghapus link");
    }
    setDeleteTarget(null);
  };

  return (
    <div>
      <PageHeader
        title="Link Marketplace"
        description="Kelola tautan toko di platform e-commerce"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Marketplace" }]}
        action={
          <button onClick={handleAddNew} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Link
          </button>
        }
      />

      {showForm && (
        <div className="admin-card p-6 mb-6">
          <h2 className="font-bold text-base mb-5">{editId ? "Edit" : "Tambah"} Link Marketplace</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-5">
            <div>
              <label className="admin-label">Platform</label>
              <select value={form.platform} onChange={(e) => setForm(p => ({ ...p, platform: e.target.value as MarketplacePlatform }))} className="admin-input">
                {platforms.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div>
              <label className="admin-label">Label Tombol</label>
              <input value={form.name} onChange={(e) => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Cth: Toko Manur Official" className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">URL / Link Toko</label>
              <input type="url" value={form.url} onChange={(e) => setForm(p => ({ ...p, url: e.target.value }))} placeholder="https://..." className="admin-input" />
            </div>
            <div className="md:col-span-2">
              <label className="admin-label">Deskripsi Singkat</label>
              <input value={form.description || ""} onChange={(e) => setForm(p => ({ ...p, description: e.target.value }))} placeholder="Cth: Dapatkan gratis ongkir di Shopee" className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Urutan Tampil (Order)</label>
              <input type="number" value={form.order} onChange={(e) => setForm(p => ({ ...p, order: Number(e.target.value) }))} className="admin-input" />
            </div>
            <div>
              <label className="admin-label">Status</label>
              <select value={form.isActive ? "true" : "false"} onChange={(e) => setForm(p => ({ ...p, isActive: e.target.value === "true" }))} className="admin-input">
                <option value="true">Aktif</option>
                <option value="false">Nonaktif</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : "Simpan"}
            </button>
            <button onClick={() => setShowForm(false)} disabled={saving} className="btn-admin-secondary">Batal</button>
          </div>
        </div>
      )}

      <div className="admin-card overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> Memuat data...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Platform & Label</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">URL</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Urutan</th>
                <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {links.map((link) => (
                <tr key={link.id} className={`hover:bg-muted/30 transition-colors ${!link.isActive ? "opacity-60" : ""}`}>
                  <td className="px-5 py-4">
                    <p className="font-semibold text-foreground">{link.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 uppercase">{link.platform}</p>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1 max-w-[200px] truncate">
                      {link.url} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                  </td>
                  <td className="px-5 py-4 font-mono text-muted-foreground">{link.order}</td>
                  <td className="px-5 py-4">
                    <button onClick={() => toggleActive(link)} className={`badge-admin ${link.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                      {link.isActive ? "Aktif" : "Nonaktif"}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2 justify-end">
                      <button onClick={() => handleEdit(link)} className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteTarget({ id: link.id, name: link.name })} className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {links.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center p-8 text-muted-foreground">
                    Belum ada data marketplace link.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
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
