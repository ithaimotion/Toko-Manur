"use client";

import { useState } from "react";
import { Bell, Check, CheckCheck, Filter, MessageSquare, ShoppingBag, Star, AlertCircle, Info } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";

type NotificationType = "CONTACT_FORM" | "NEW_ORDER" | "NEW_REVIEW" | "SYSTEM_ALERT" | "GENERAL";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  link: string | null;
  createdAt: string;
  updatedAt: string;
}

const TYPE_LABELS: Record<NotificationType, string> = {
  CONTACT_FORM: "Pesan Masuk",
  NEW_ORDER: "Pesanan Baru",
  NEW_REVIEW: "Ulasan Baru",
  SYSTEM_ALERT: "Sistem",
  GENERAL: "Umum",
};

const TYPE_ICONS: Record<NotificationType, React.ReactNode> = {
  CONTACT_FORM: <MessageSquare className="w-4 h-4" />,
  NEW_ORDER: <ShoppingBag className="w-4 h-4" />,
  NEW_REVIEW: <Star className="w-4 h-4" />,
  SYSTEM_ALERT: <AlertCircle className="w-4 h-4" />,
  GENERAL: <Info className="w-4 h-4" />,
};

const TYPE_COLORS: Record<NotificationType, string> = {
  CONTACT_FORM: "bg-blue-100 text-blue-600",
  NEW_ORDER: "bg-green-100 text-green-600",
  NEW_REVIEW: "bg-yellow-100 text-yellow-600",
  SYSTEM_ALERT: "bg-red-100 text-red-600",
  GENERAL: "bg-slate-100 text-slate-600",
};

function formatRelativeTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Baru saja";
  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  if (diffDays < 7) return `${diffDays} hari lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
}

export default function NotificationsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<"all" | "unread" | "read">("all");
  const [typeFilter, setTypeFilter] = useState<NotificationType | "all">("all");

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (!json.success) throw new Error("Gagal mengambil notifikasi");
      return json.data;
    },
    refetchInterval: 30000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => {
      await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((n: any) => n.id === id ? { ...n, isRead: true } : n)
      );
      return { previous };
    },
    onError: (_err: any, _id: any, ctx: any) => {
      queryClient.setQueryData(["notifications"], ctx?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: async () => {
      // Include ALL unread notifications — the API now handles sys- ones by saving to file
      const unread = notifications.filter((n) => !n.isRead);
      await Promise.all(
        unread.map((n) =>
          fetch("/api/notifications", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: n.id }),
          })
        )
      );
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["notifications"] });
      const previous = queryClient.getQueryData(["notifications"]);
      // Optimistically mark ALL as read in the UI immediately (including sys-)
      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((n: any) => ({ ...n, isRead: true }))
      );
      return { previous };
    },
    onError: (_err: any, _vars: any, ctx: any) => {
      queryClient.setQueryData(["notifications"], ctx?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleClick = (notif: Notification) => {
    if (!notif.isRead) {
      markReadMutation.mutate(notif.id);
    }
    if (notif.link) {
      router.push(notif.link);
    }
  };

  const filtered = notifications.filter((n) => {
    const matchRead =
      filter === "all" ? true : filter === "unread" ? !n.isRead : n.isRead;
    const matchType = typeFilter === "all" ? true : n.type === typeFilter;
    return matchRead && matchType;
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;
  const ALL_TYPES = Object.keys(TYPE_LABELS) as NotificationType[];

  const todayCount = notifications.filter((n) => {
    const today = new Date();
    const d = new Date(n.createdAt);
    return (
      d.getDate() === today.getDate() &&
      d.getMonth() === today.getMonth() &&
      d.getFullYear() === today.getFullYear()
    );
  }).length;

  return (
    <div>
      <PageHeader
        title="Notifikasi"
        description="Semua notifikasi dan aktivitas sistem Anda"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Notifikasi" }]}
        action={
          unreadCount > 0 ? (
            <button
              onClick={() => markAllReadMutation.mutate()}
              disabled={markAllReadMutation.isPending}
              className="btn-admin-secondary flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              Tandai Semua Dibaca
            </button>
          ) : undefined
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
        <div className="admin-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Total</p>
          <p className="text-2xl font-bold text-foreground">{notifications.length}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Belum Dibaca</p>
          <p className="text-2xl font-bold text-primary">{unreadCount}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Sudah Dibaca</p>
          <p className="text-2xl font-bold text-slate-500">{notifications.length - unreadCount}</p>
        </div>
        <div className="admin-card p-4">
          <p className="text-xs text-muted-foreground mb-1">Hari Ini</p>
          <p className="text-2xl font-bold text-emerald-600">{todayCount}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="admin-card p-4 mt-6 flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-muted-foreground" />
          {(["all", "unread", "read"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                filter === f
                  ? "bg-primary text-white"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              {f === "all" ? "Semua" : f === "unread" ? "Belum Dibaca" : "Sudah Dibaca"}
            </button>
          ))}
        </div>
        {ALL_TYPES.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setTypeFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                typeFilter === "all"
                  ? "bg-primary/10 text-primary border border-primary/30"
                  : "bg-secondary text-muted-foreground hover:text-foreground"
              }`}
            >
              Semua Tipe
            </button>
            {ALL_TYPES.map((t) => {
              const count = notifications.filter((n) => n.type === t).length;
              return (
                <button
                  key={t}
                  onClick={() => setTypeFilter(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    typeFilter === t
                      ? "bg-primary/10 text-primary border border-primary/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {TYPE_LABELS[t]}
                  {count > 0 && (
                    <span className={`text-[10px] rounded-full px-1.5 font-bold ${
                      typeFilter === t ? "bg-primary text-white" : "bg-muted-foreground/20"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Notification List */}
      <div className="mt-4">
        {isLoading ? (
          <TableSkeleton columns={3} rows={6} showActions={false} />
        ) : filtered.length === 0 ? (
          <div className="admin-card p-12 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="font-semibold text-base mb-1">Tidak ada notifikasi</h3>
            <p className="text-muted-foreground text-sm">
              {filter !== "all" || typeFilter !== "all"
                ? "Tidak ada notifikasi yang cocok dengan filter yang dipilih."
                : "Belum ada notifikasi masuk saat ini."}
            </p>
          </div>
        ) : (
          <div className="admin-card overflow-hidden divide-y divide-border">
            {filtered.map((notif) => (
              <div
                key={notif.id}
                onClick={() => handleClick(notif)}
                className={`flex items-start gap-4 p-4 sm:p-5 transition-colors cursor-pointer group ${
                  !notif.isRead
                    ? "bg-primary/5 hover:bg-primary/10"
                    : "hover:bg-muted/50"
                }`}
              >
                {/* Icon badge */}
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                    TYPE_COLORS[notif.type] ?? "bg-slate-100 text-slate-600"
                  }`}
                >
                  {TYPE_ICONS[notif.type] ?? <Info className="w-4 h-4" />}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4
                        className={`text-sm leading-snug ${
                          !notif.isRead
                            ? "font-semibold text-foreground"
                            : "font-medium text-muted-foreground"
                        }`}
                      >
                        {notif.title}
                      </h4>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide ${
                          TYPE_COLORS[notif.type] ?? "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {TYPE_LABELS[notif.type] ?? notif.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-primary shrink-0" />
                      )}
                      <span className="text-[11px] text-muted-foreground whitespace-nowrap">
                        {formatRelativeTime(notif.createdAt)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {notif.message}
                  </p>
                  {notif.link && (
                    <p className="text-xs text-primary mt-1.5 group-hover:underline">
                      Lihat detail →
                    </p>
                  )}
                </div>

                {/* Mark read button */}
                {!notif.isRead && !notif.id.startsWith("sys-") && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      markReadMutation.mutate(notif.id);
                    }}
                    className="shrink-0 p-1.5 rounded-lg hover:bg-primary/20 text-primary opacity-0 group-hover:opacity-100 transition-all"
                    title="Tandai dibaca"
                  >
                    <Check className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {!isLoading && filtered.length > 0 && (
        <p className="text-center text-xs text-muted-foreground mt-4 pb-4">
          Menampilkan {filtered.length} dari {notifications.length} notifikasi
        </p>
      )}
    </div>
  );
}
