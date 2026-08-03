"use client";

import { useEffect, useState } from "react";
import { Check, X, Key, Search, RefreshCw } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { getResetRequests, updateResetRequestStatus } from "@/app/actions/users";
import type { RequestStatus } from "@toko-manur/db";

interface ResetItem {
  id: string;
  email: string;
  status: RequestStatus;
  createdAt: Date;
}

export default function ResetRequestsPage() {
  const [requests, setRequests] = useState<ResetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchRequests = async () => {
    setLoading(true);
    const res = await getResetRequests();
    if (res.success && res.data) {
      setRequests(res.data as ResetItem[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleUpdateStatus = async (id: string, status: RequestStatus) => {
    const res = await updateResetRequestStatus(id, status);
    if (res.success) {
      fetchRequests();
    } else {
      alert("Gagal memperbarui status.");
    }
  };

  const filteredRequests = requests.filter((r) =>
    r.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <PageHeader
        title="Permintaan Reset Password"
        description="Kelola daftar permintaan reset password dari pengguna terhubung ke MySQL"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Pengguna", href: "/users" }, { label: "Permintaan Reset" }]}
      />

      <div className="admin-card overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Cari email..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="admin-input pl-9"
            />
          </div>
          <button onClick={fetchRequests} className="p-1.5 hover:bg-muted rounded-md transition-colors text-muted-foreground" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        {/* Table */}
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Email Pengguna</th>
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Waktu Permintaan</th>
              <th className="text-left px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Status</th>
              <th className="text-right px-5 py-3 font-semibold text-muted-foreground text-xs uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredRequests.map((req) => (
              <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                      <Key className="w-4 h-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{req.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-muted-foreground text-xs">
                  {new Date(req.createdAt).toLocaleString("id-ID")}
                </td>
                <td className="px-5 py-4">
                  {req.status === "PENDING" ? (
                    <span className="badge-admin bg-amber-100 text-amber-700">Menunggu</span>
                  ) : req.status === "APPROVED" ? (
                    <span className="badge-admin bg-emerald-100 text-emerald-700">Disetujui</span>
                  ) : (
                    <span className="badge-admin bg-red-100 text-red-700">Ditolak</span>
                  )}
                </td>
                <td className="px-5 py-4">
                  {req.status === "PENDING" ? (
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleUpdateStatus(req.id, "APPROVED")}
                        className="p-1.5 hover:bg-emerald-50 text-emerald-600 rounded-md transition-colors"
                        title="Setujui Reset"
                      >
                        <Check className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleUpdateStatus(req.id, "REJECTED")}
                        className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
                        title="Tolak Permintaan"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-right text-xs text-muted-foreground italic">
                      {req.status === "APPROVED" ? "Disetujui" : "Ditolak"}
                    </div>
                  )}
                </td>
              </tr>
            ))}
            {!loading && filteredRequests.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-8 text-center text-muted-foreground text-sm">
                  Tidak ada permintaan reset password.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
