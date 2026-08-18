"use client";

import { Bell, Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { logoutAction } from "@/lib/actions/auth";
import { getMyProfile } from "@/lib/actions/users";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";

export function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { data: profile } = useQuery({
    queryKey: ["myProfile"],
    queryFn: async () => {
      const res = await getMyProfile();
      if (!res.success) throw new Error(res.error);
      return res.data;
    }
  });

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications");
      const json = await res.json();
      if (!json.success) throw new Error("Gagal mengambil notifikasi");
      return json.data;
    },
    refetchInterval: 30000 // Poll every 30 seconds
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
      const previousNotifications = queryClient.getQueryData(["notifications"]);
      queryClient.setQueryData(["notifications"], (old: any) =>
        old?.map((n: any) => n.id === id ? { ...n, isRead: true } : n)
      );
      return { previousNotifications };
    },
    onError: (err, id, context) => {
      queryClient.setQueryData(["notifications"], context?.previousNotifications);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    }
  });

  const handleNotificationClick = (id: string, link: string | null) => {
    markReadMutation.mutate(id);
    setNotificationsOpen(false);
    if (link) {
      router.push(link);
    }
  };

  const handleLogout = async () => {
    setUserMenuOpen(false);
    setNotificationsOpen(false);
    await logoutAction();
    router.push("/admin/login");
  };

  return (
    <header className="h-16 bg-[#fcfbff] border-b border-[#e8dce7] flex items-center justify-between px-6 shrink-0 z-10">
      {/* Search */}
      <div className="flex items-center gap-2 bg-[#f7f1f8] rounded-lg px-3 py-2 w-64">
        <Search className="w-4 h-4 text-[#8a7d8d]" />
        <input
          type="search"
          placeholder="Cari..."
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-[#8a7d8d] text-[#4b3f49]"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <div className="relative">
          <button
            id="notifications-btn"
            onClick={() => {
              setNotificationsOpen(!notificationsOpen);
              setUserMenuOpen(false);
            }}
            className="relative p-2 rounded-lg hover:bg-[#f8ebf6] transition-colors text-[#8a7d8d] hover:text-[#78a4cb]"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {notifications.some(n => !n.isRead) && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 w-80 bg-[#fffdfd] rounded-xl border border-[#e8dce7] shadow-lg py-2 z-50 overflow-hidden">
              <div className="px-4 py-2 border-b border-border flex items-center justify-between">
                <h3 className="font-semibold text-sm">Notifikasi</h3>
                <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
                  {notifications.filter(n => !n.isRead).length} Baru
                </span>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-4 text-center text-sm text-slate-500">Tidak ada notifikasi</div>
                ) : (
                  notifications.map((notif: any) => (
                    <div 
                      key={notif.id}
                      onClick={() => handleNotificationClick(notif.id, notif.link)}
                      className={`p-4 border-b border-border last:border-0 hover:bg-slate-50 cursor-pointer transition-colors ${!notif.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className={`text-sm ${!notif.isRead ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                          {notif.title}
                        </h4>
                        {!notif.isRead && <span className="w-2 h-2 bg-primary rounded-full mt-1.5 shrink-0" />}
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notif.message}</p>
                      <p className="text-[10px] text-slate-400 mt-2">
                        {new Date(notif.createdAt).toLocaleDateString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Menu */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => {
              setUserMenuOpen(!userMenuOpen);
              setNotificationsOpen(false);
            }}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-[#f8ebf6] transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center overflow-hidden border border-primary-200">
              {profile?.avatar ? (
                <Image src={profile.avatar} alt="Avatar" width={32} height={32} className="object-cover w-full h-full" />
              ) : (
                <User className="w-4 h-4 text-white" />
              )}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-[#4b3f49] leading-none">{profile?.name || "Memuat..."}</p>
              <p className="text-[10px] uppercase font-bold text-primary mt-0.5">{profile?.role?.replace("_", " ") || "ADMIN"}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-[#8a7d8d] hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-[#fffdfd] rounded-xl border border-[#e8dce7] shadow-lg py-1 z-50">
              <Link
                href="/admin/profile"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Profil Saya
              </Link>
              <hr className="my-1 border-border" />
              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
