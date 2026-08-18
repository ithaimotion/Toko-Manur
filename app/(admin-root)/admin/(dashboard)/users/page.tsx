"use client";

import { useState } from "react";
import { Plus, MoreVertical, X, Eye, Activity, ShieldAlert, Key, Loader2, ShieldCheck, UserX, Trash2, Shield, User, RefreshCw, ToggleLeft, ToggleRight, Clock } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";
import { ConfirmDeleteModal } from "@/components/admin/ui/ConfirmDeleteModal";
import { getUsers, createUser, deleteUser, toggleUserStatus, getUserActivity } from "@/lib/actions/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Role, UserStatus } from "@/lib/db";

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
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [detailTarget, setDetailTarget] = useState<UserItem | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "EDITOR" as Role,
  });

  const { data: users = [], isLoading } = useQuery({
    queryKey: ["adminUsers"],
    queryFn: async () => {
      const res = await getUsers();
      if (!res.success) throw new Error(res.error || "Gagal mengambil data pengguna");
      return res.data as UserItem[];
    }
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await createUser(data);
      if (!res.success) throw new Error(res.error || "Gagal membuat pengguna.");
      return res;
    },
    onSuccess: () => {
      setShowModal(false);
      setFormData({ name: "", email: "", role: "EDITOR" });
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Pengguna berhasil dibuat.");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await deleteUser(id);
      if (!res.success) throw new Error(res.error || "Gagal menghapus pengguna.");
      return res;
    },
    onSuccess: () => {
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
      toast.success("Pengguna berhasil dihapus.");
    },
    onError: (error: any) => {
      toast.error(error.message);
    }
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ id, currentStatus }: { id: string, currentStatus: UserStatus }) => {
      const res = await toggleUserStatus(id, currentStatus);
      if (!res.success) throw new Error(res.error);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminUsers"] });
    }
  });

  const { data: userActivities = [], isLoading: loadingActivities } = useQuery({
    queryKey: ["userActivity", detailTarget?.id],
    queryFn: async () => {
      if (!detailTarget) return [];
      const res = await getUserActivity(detailTarget.id);
      if (!res.success) throw new Error(res.error);
      return res.data;
    },
    enabled: !!detailTarget
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = () => {
    if (deleteTarget) deleteMutation.mutate(deleteTarget.id);
  };

  const handleToggle = (id: string, currentStatus: UserStatus) => {
    toggleMutation.mutate({ id, currentStatus });
  };

  return (
    <div>
      <PageHeader
        title="Pengguna Sistem"
        description="Kelola akun admin dan hak akses pengguna"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Pengguna" }]}
        action={
          <button onClick={() => setShowModal(true)} className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        }
      />

      {isLoading ? (
        <TableSkeleton columns={5} rows={3} showActions={false} />
      ) : users.length === 0 ? (
        <div className="admin-card p-12 flex flex-col items-center justify-center text-center">
          <UserX className="w-12 h-12 text-slate-300 mb-4" />
          <h3 className="text-lg font-semibold">Belum ada pengguna</h3>
          <p className="text-muted-foreground text-sm">Tambahkan pengguna baru untuk memulai.</p>
        </div>
      ) : (
        <div className="admin-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Nama & Email</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Peran</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Login Terakhir</th>
                  <th className="text-left px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Status</th>
                  <th className="text-right px-5 py-3.5 font-semibold text-muted-foreground text-xs uppercase">Aksi</th>
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
                        disabled={toggleMutation.isPending}
                        className={`badge-admin flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity ${u.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}
                      >
                        {u.status === "ACTIVE" ? <ToggleRight className="w-3.5 h-3.5" /> : <ToggleLeft className="w-3.5 h-3.5" />}
                        {u.status === "ACTIVE" ? "Aktif" : "Nonaktif"}
                      </button>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          onClick={() => setDetailTarget(u)}
                          className="p-1.5 hover:bg-primary-50 hover:text-primary-600 rounded-md transition-colors text-muted-foreground"
                          title="Detail Pengguna"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
              </tbody>
            </table>
          </div>
        </div>
      )}

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
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="btn-admin-secondary">Batal</button>
                <button type="submit" disabled={createMutation.isPending} className="btn-admin-primary flex-1 justify-center">
                  {createMutation.isPending ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailTarget && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl w-full max-w-lg p-6 shadow-2xl flex flex-col max-h-[85vh]">
            <h2 className="text-lg font-bold text-foreground mb-1">Detail Pengguna</h2>
            <p className="text-sm text-muted-foreground mb-4">Melihat log aktivitas {detailTarget.name}</p>
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
              {loadingActivities ? (
                <div className="flex flex-col gap-4 py-4">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="flex gap-4 animate-pulse">
                      <div className="w-10 h-10 rounded-full bg-slate-200 shrink-0"></div>
                      <div className="flex-1 space-y-2 py-1">
                        <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-3 bg-slate-100 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : userActivities?.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center text-muted-foreground">
                  <ShieldAlert className="w-10 h-10 mb-2 opacity-20" />
                  <p>Belum ada aktivitas tercatat.</p>
                </div>
              ) : (
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                  {userActivities?.map((log: any) => (
                    <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 group-[.is-active]:bg-primary-100 text-slate-500 group-[.is-active]:text-primary-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                        <Clock className="w-4 h-4" />
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] admin-card p-3 rounded-xl border border-border">
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-foreground">{log.action}</span>
                          <span className="text-[10px] text-muted-foreground bg-muted px-2 py-0.5 rounded-full">{new Date(log.createdAt).toLocaleString("id-ID", { dateStyle: "short", timeStyle: "short" })}</span>
                        </div>
                        <p className="text-xs text-slate-500">{log.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 mt-4 border-t border-border flex justify-end">
              <button type="button" onClick={() => setDetailTarget(null)} className="btn-admin-secondary">
                Tutup
              </button>
            </div>
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
