"use client";

import { useState } from "react";
import { Save, Loader2, Code, ShieldCheck, Database, KeyRound } from "lucide-react";
import { PageHeader } from "@/components/admin/ui/PageHeader";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  const tabs = [
    { id: "general", label: "Umum", icon: Database },
    { id: "security", label: "Keamanan", icon: ShieldCheck },
    { id: "integration", label: "Integrasi API", icon: Code },
  ];

  return (
    <div>
      <PageHeader
        title="Pengaturan Sistem"
        description="Konfigurasi teknis dashboard dan website"
        breadcrumb={[{ label: "Dashboard", href: "/admin" }, { label: "Pengaturan" }]}
        action={
          <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Konfigurasi
          </button>
        }
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <div className="admin-card p-2 space-y-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === t.id
                    ? "bg-primary-50 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <t.icon className="w-4 h-4" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1">
          {activeTab === "general" && (
            <div className="admin-card p-6 space-y-5">
              <h2 className="font-bold text-base mb-4 border-b border-border pb-2">Pengaturan Umum</h2>
              <div>
                <label className="admin-label">Nama Website</label>
                <input defaultValue="Toko Manur" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">URL Website Utama (Public)</label>
                <input defaultValue="https://tokomanur.id" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Timezone Default</label>
                <select className="admin-input">
                  <option value="Asia/Jakarta">Asia/Jakarta (WIB)</option>
                  <option value="Asia/Makassar">Asia/Makassar (WITA)</option>
                  <option value="Asia/Jayapura">Asia/Jayapura (WIT)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="admin-card p-6 space-y-5">
              <h2 className="font-bold text-base mb-4 border-b border-border pb-2">Keamanan</h2>
              <div className="p-4 bg-amber-50 border border-amber-100 rounded-lg flex gap-3">
                <KeyRound className="w-5 h-5 text-amber-600 shrink-0" />
                <div>
                  <p className="font-medium text-amber-900 text-sm">Ganti Password Akun Anda</p>
                  <p className="text-xs text-amber-700 mt-1">Sangat disarankan untuk mengganti password secara berkala.</p>
                </div>
              </div>
              <div>
                <label className="admin-label">Password Lama</label>
                <input type="password" placeholder="••••••••" className="admin-input" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Password Baru</label>
                  <input type="password" placeholder="••••••••" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Konfirmasi Password Baru</label>
                  <input type="password" placeholder="••••••••" className="admin-input" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "integration" && (
            <div className="admin-card p-6 space-y-5">
              <h2 className="font-bold text-base mb-4 border-b border-border pb-2">Integrasi API & Analytics</h2>
              <div>
                <label className="admin-label">Google Analytics Measurement ID</label>
                <input placeholder="G-XXXXXXXXXX" className="admin-input" />
              </div>
              <div>
                <label className="admin-label">Facebook Pixel ID</label>
                <input placeholder="1234567890" className="admin-input" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
