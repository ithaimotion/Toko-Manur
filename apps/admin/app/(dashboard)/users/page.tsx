"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Shield, User, RefreshCw, ToggleLeft, ToggleRight } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { ConfirmDeleteModal } from "@/components/ui/ConfirmDeleteModal";
import { getUsers, createUser, deleteUser, toggleUserStatus } from "@/app/actions/users";
import type { Role, UserStatus } from "@toko-manur/db";

interface UserItem {
  id: string;
  name: string;
  email: string;
  role: Role;
  status: UserStatus;
  lastLogin: Date | null;
  createdAt: Date;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EDITOR" as Role,
  });

  const fetchUsers = async () => {
    setLoading(true);
    const res = await getUsers();
    if (res.success && res.data) {
      setUsers(res.data as UserItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const res = await createUser(formData);
    setSubmitting(false);
    if (res.success) {
      setShowModal(false);
      setFormData({ name: "", email: "", role: "EDITOR" });
      fetchUsers();
      toast.success("Pengguna berhasil dibuat.");
    } else {
      toast.error(res.error || "Gagal membuat pengguna.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const res = await deleteUser(deleteTarget.id);
    setDeleting(false);
    setDeleteTarget(null);
    if (res.success) {
      fetchUsers();
      toast.success("Pengguna berhasil dihapus.");
    } else {
      toast.error(res.error || "Gagal menghapus pengguna.");
    }
  };

  const handleToggle = async (id: string, currentStatus: UserStatus) => {
    const res = await toggleUserStatus(id, currentStatus);
    if (res.success) {
      fetchUsers();
    }
  };

  return (
    <div>
      <PageHeader
        title="Pengguna Sistem"
        description="Kelola akun admin dan hak akses pengguna terhubung ke database XAMPP MySQL"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Pengguna" }]}
        action={
          <button onClick={() => setShowModal(true)} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        }
      />

      {/* Table Container */}
      <div className="admin-card overflow-hidden">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground">Total: <span className="font-bold text-foreground">{users.length}</span> Pengguna</p>
          <button onClick={fetchUsers} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground" title="Refresh data">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Pengguna</th>
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Peran (Role)</th>
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase hidden md:table-cell">Login Terakhir</th>
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((u) => (
              <tr key={u.id} className={`hover:bg-muted/30 transition-colors ${u.status === "INACTIVE" ? "opacity-60" : ""}`}>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{u.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5 text-xs font-medium">
                    {u.role === "SUPER_ADMIN" ? (
                      <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full"><Shield className="w-3 h-3" /> Super Admin</span>
                    ) : u.role === "EDITOR" ? (
                      <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">Editor</span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Viewer</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground text-xs hidden md:table-cell">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleString("id-ID") : "Belum pernah"}
                </td>
                <td className="px-5 py-4">
                  <button 
                    onClick={() => handleToggle(u.id, u.status)}
                    className={`badge-admin flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                  >
                    {u.status === "ACTIVE" ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                    {u.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                  </button>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    {u.role !== "SUPER_ADMIN" && (
                      <button 
                        onClick={() => setDeleteTarget({ id: u.id, name: u.name })} 
                        className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"
                        title="Hapus Pengguna"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-muted-foreground text-sm">
                  Belum ada pengguna terdaftar di database MySQL.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Add User */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4">
            <h2 className="text-lg font-bold text-foreground">Tambah Pengguna Baru</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="admin-label">Nama Lengkap</label>
                <input 
                  type="text" 
                  value={formData.name} 
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
                  placeholder="Masukkan nama" 
                  className="admin-input" 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Email</label>
                <input 
                  type="email" 
                  value={formData.email} 
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                  placeholder="email@tokomanur.id" 
                  className="admin-input" 
                  required 
                />
              </div>
              <div>
                <label className="admin-label">Peran (Role)</label>
                <select 
                  value={formData.role} 
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })} 
                  className="admin-input"
                >
                  <option value="EDITOR">Editor</option>
                  <option value="VIEWER">Viewer</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={submitting} className="btn-admin-primary flex-1 justify-center">
                  {submitting ? "Menyimpan..." : "Simpan Pengguna"}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">
                  Batal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ConfirmDeleteModal
        isOpen={!!deleteTarget}
        itemName={deleteTarget?.name}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  );
}
