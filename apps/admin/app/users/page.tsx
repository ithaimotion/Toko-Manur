"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, Shield, User } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";

export default function AdminUsersPage() {
  const [users] = useState([
    { id: "1", name: "Admin Utama", email: "admin@tokomanur.id", role: "super_admin", lastLogin: "Hari ini, 08:30 WIB", status: "active" },
    { id: "2", name: "Content Creator", email: "content@tokomanur.id", role: "editor", lastLogin: "Kemarin, 14:15 WIB", status: "active" },
    { id: "3", name: "Tim Support", email: "support@tokomanur.id", role: "viewer", lastLogin: "3 hari yang lalu", status: "inactive" },
  ]);

  return (
    <div>
      <PageHeader
        title="Pengguna Sistem"
        description="Kelola akses admin dan pengguna sistem dashboard"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Pengguna" }]}
        action={
          <button className="btn-admin-primary">
            <Plus className="w-4 h-4" /> Tambah Pengguna
          </button>
        }
      />

      <div className="admin-card overflow-hidden">
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
              <tr key={u.id} className={`hover:bg-muted/30 transition-colors ${u.status === "inactive" ? "opacity-60" : ""}`}>
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
                    {u.role === "super_admin" ? (
                      <span className="flex items-center gap-1 text-purple-700 bg-purple-100 px-2.5 py-1 rounded-full"><Shield className="w-3 h-3" /> Super Admin</span>
                    ) : u.role === "editor" ? (
                      <span className="text-blue-700 bg-blue-100 px-2.5 py-1 rounded-full">Editor</span>
                    ) : (
                      <span className="text-slate-600 bg-slate-100 px-2.5 py-1 rounded-full">Viewer</span>
                    )}
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground text-xs hidden md:table-cell">{u.lastLogin}</td>
                <td className="px-5 py-4">
                  <span className={`badge-admin ${u.status === "active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {u.status === "active" ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 justify-end">
                    <button className="p-1.5 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors text-muted-foreground"><Pencil className="w-4 h-4" /></button>
                    {u.role !== "super_admin" && (
                      <button className="p-1.5 hover:bg-red-50 hover:text-destructive rounded-md transition-colors text-muted-foreground"><Trash2 className="w-4 h-4" /></button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
