"use client";

import { useState } from "react";
import { Save, Loader2, Globe, Target, Heart, Zap, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockCompanyProfile } from "@toko-manur/mock-data";

const iconOptions = [
  { value: "shield", label: "Shield", icon: "🛡️" },
  { value: "heart", label: "Heart", icon: "❤️" },
  { value: "zap", label: "Zap", icon: "⚡" },
  { value: "star", label: "Star", icon: "⭐" },
];

export default function AdminCompanyProfilePage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    about: mockCompanyProfile.about,
    vision: mockCompanyProfile.vision,
    mission: mockCompanyProfile.mission.join("\n"),
    brandStory: mockCompanyProfile.brandStory,
    founded: mockCompanyProfile.founded,
  });

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div>
      <PageHeader
        title="Profil Perusahaan"
        description="Kelola informasi dan profil perusahaan"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Profil Perusahaan" }]}
        action={
          <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* About */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Tentang Perusahaan</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Tahun Berdiri</label>
              <input type="number" value={form.founded} onChange={(e) => setForm(p => ({ ...p, founded: e.target.value }))} className="admin-input w-32" />
            </div>
            <div>
              <label className="admin-label">Deskripsi Perusahaan</label>
              <textarea value={form.about} onChange={(e) => setForm(p => ({ ...p, about: e.target.value }))} rows={6} className="admin-input resize-y" />
            </div>
          </div>
        </div>

        {/* Vision & Mission */}
        <div className="admin-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Target className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Visi & Misi</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="admin-label">Visi</label>
              <textarea value={form.vision} onChange={(e) => setForm(p => ({ ...p, vision: e.target.value }))} rows={3} className="admin-input resize-none" />
            </div>
            <div>
              <label className="admin-label">Misi (satu per baris)</label>
              <textarea value={form.mission} onChange={(e) => setForm(p => ({ ...p, mission: e.target.value }))} rows={6} placeholder="Setiap baris = satu poin misi" className="admin-input resize-y font-mono text-sm" />
              <p className="text-xs text-muted-foreground mt-1">{form.mission.split("\n").filter(Boolean).length} poin misi</p>
            </div>
          </div>
        </div>

        {/* Brand Story */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center gap-2 mb-5">
            <Heart className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Brand Story</h2>
          </div>
          <textarea value={form.brandStory} onChange={(e) => setForm(p => ({ ...p, brandStory: e.target.value }))} rows={5} className="admin-input resize-y" />
        </div>

        {/* Values */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Nilai-Nilai Perusahaan</h2>
            </div>
            <button className="btn-admin-secondary text-xs">+ Tambah Nilai</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockCompanyProfile.values.map((val) => (
              <div key={val.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <select className="admin-input w-24 text-xs py-1.5">
                    {iconOptions.map((opt) => (
                      <option key={opt.value} value={opt.value} selected={opt.value === val.icon}>{opt.icon} {opt.label}</option>
                    ))}
                  </select>
                  <input defaultValue={val.title} className="admin-input flex-1 text-sm" placeholder="Judul nilai" />
                </div>
                <textarea defaultValue={val.description} rows={2} className="admin-input resize-none text-sm" />
              </div>
            ))}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">Dokumen Legal</h2>
            <button className="btn-admin-secondary text-xs">+ Tambah Dokumen</button>
          </div>
          <div className="space-y-3">
            {mockCompanyProfile.legalDocuments.map((doc) => (
              <div key={doc.id} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 border border-border rounded-lg">
                <input defaultValue={doc.name} placeholder="Nama dokumen" className="admin-input text-sm" />
                <input defaultValue={doc.number} placeholder="Nomor dokumen" className="admin-input text-sm" />
                <input defaultValue={doc.issuedBy} placeholder="Diterbitkan oleh" className="admin-input text-sm" />
                <input type="date" defaultValue={doc.issuedDate} className="admin-input text-sm" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
