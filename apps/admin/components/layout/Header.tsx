"use client";

import { Bell, Search, User, LogOut, Settings, ChevronDown } from "lucide-react";
import { useState } from "react";
import Link from "next/link";

export function Header() {
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 shrink-0 z-10">
      {/* Search */}
      <div className="flex items-center gap-2 bg-secondary rounded-lg px-3 py-2 w-64">
        <Search className="w-4 h-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="Cari..."
          className="bg-transparent text-sm outline-none flex-1 placeholder:text-muted-foreground"
        />
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        {/* Notifications */}
        <button
          id="notifications-btn"
          className="relative p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground hover:text-foreground"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white" />
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            id="user-menu-btn"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-secondary transition-colors"
          >
            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-sm font-semibold text-foreground leading-none">Admin Utama</p>
              <p className="text-xs text-muted-foreground mt-0.5">Super Admin</p>
            </div>
            <ChevronDown className="w-4 h-4 text-muted-foreground hidden sm:block" />
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 top-12 w-48 bg-white rounded-xl border border-border shadow-lg py-1 z-50">
              <Link
                href="/settings"
                className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-secondary transition-colors"
                onClick={() => setUserMenuOpen(false)}
              >
                <Settings className="w-4 h-4 text-muted-foreground" />
                Pengaturan
              </Link>
              <hr className="my-1 border-border" />
              <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-red-50 transition-colors">
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
