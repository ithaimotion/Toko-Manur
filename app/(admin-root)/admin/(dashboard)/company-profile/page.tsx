"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Globe, Target, Heart, Zap, Star, Shield, Flame, Award, Activity, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ImageUpload } from "@/components/admin/ui/ImageUpload";
import { mockCompanyProfile } from "@/lib/mock-data";

const iconOptions = [
  { value: "shield", label: "Shield", Icon: Shield },
  { value: "heart", label: "Heart", Icon: Heart },
  { value: "zap", label: "Zap", Icon: Zap },
  { value: "star", label: "Star", Icon: Star },
  { value: "fire", label: "Fire", Icon: Flame },
  { value: "award", label: "Award", Icon: Award },
  { value: "activity", label: "Activity", Icon: Activity },
];

export default function AdminCompanyProfilePage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(() => ({
    about: "",
    aboutImage: "",
    vision: "",
    mission: "",
    brandStory: "",
    founded: "",
    privacyPolicy: "",
    values: [] as any[],
    legalDocuments: [] as any[],
  }));

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('/api/company');
        const json = await res.json();
        if (json.success && json.data && mounted) {
          const p = json.data;
          setForm({
            about: p.about || "",
            aboutImage: p.aboutImage || "",
            vision: p.vision || "",
            mission: Array.isArray(p.mission) ? p.mission.join('\n') : (p.mission || '').toString(),
            brandStory: p.brandStory || "",
            founded: p.founded || "",
            privacyPolicy: p.privacyPolicy || "",
            values: (p.values || []).map((v: any) => ({ ...v })),
            legalDocuments: (p.legalDocuments || []).map((d: any) => ({ ...d })),
          });
        }
      } catch (e) {
        // ignore
      }
    })();
    return () => { mounted = false };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = {
        about: form.about,
        aboutImage: form.aboutImage,
        vision: form.vision,
        mission: form.mission.split("\n").filter(Boolean),
        brandStory: form.brandStory,
        founded: form.founded,
        privacyPolicy: form.privacyPolicy,
        values: form.values,
        legalDocuments: form.legalDocuments,
      };

      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) {
        toast.error(json.error || "Gagal menyimpan.");
      } else {
        toast.success("Profil perusahaan berhasil disimpan.");
      }
    } catch (error) {
      toast.error("Gagal menyimpan.");
    } finally {
      setSaving(false);
    }
  };

  const handleAddValue = () => {
    setForm((prev) => ({
      ...prev,
      values: [
        ...prev.values,
        {
          id: crypto.randomUUID(),
          icon: "star",
          title: "",
          description: "",
        },
      ],
    }));
  };

  const handleValueChange = (index: number, field: "icon" | "title" | "description", value: string) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleRemoveValue = (index: number) => {
    setForm((prev) => ({
      ...prev,
      values: prev.values.filter((_, i) => i !== index),
    }));
  };

  const handleAddDocument = () => {
    setForm((prev) => ({
      ...prev,
      legalDocuments: [
        ...prev.legalDocuments,
        {
          id: crypto.randomUUID(),
          name: "",
          number: "",
          issuedBy: "",
          issuedDate: "",
        },
      ],
    }));
  };

  const handleDocumentChange = (index: number, field: "name" | "number" | "issuedBy" | "issuedDate", value: string) => {
    setForm((prev) => ({
      ...prev,
      legalDocuments: prev.legalDocuments.map((item, itemIndex) => (itemIndex === index ? { ...item, [field]: value } : item)),
    }));
  };

  const handleRemoveDocument = (index: number) => {
    setForm((prev) => ({
      ...prev,
      legalDocuments: prev.legalDocuments.filter((_, i) => i !== index),
    }));
  };

  return (
    <div>
      <PageHeader
        title="Profil Perusahaan"
        description="Kelola informasi dan profil perusahaan"
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Profil Perusahaan" }]}
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
              <label className="admin-label">Gambar Tentang Perusahaan</label>
              <ImageUpload
                value={form.aboutImage}
                onChange={(url) => setForm(p => ({ ...p, aboutImage: url }))}
                label="Upload Gambar"
                aspectRatio="[4/3]"
              />
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
            <button type="button" onClick={handleAddValue} className="btn-admin-secondary text-xs">+ Tambah Nilai</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.values.map((val, index) => {
              const Opt = iconOptions.find((o) => o.value === val.icon)?.Icon ?? Star;
              return (
                <div key={val.id} className="border border-border rounded-lg p-4 relative group">
                  <button type="button" onClick={() => handleRemoveValue(index)} className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center gap-3 mb-3 pr-8">
                    <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center shrink-0">
                      <Opt className="w-5 h-5 text-primary" />
                    </div>
                    <select value={val.icon} onChange={(e) => handleValueChange(index, "icon", e.target.value)} className="admin-input w-28 text-xs py-1.5">
                      {iconOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                      ))}
                    </select>
                    <input value={val.title} onChange={(e) => handleValueChange(index, "title", e.target.value)} className="admin-input flex-1 text-sm" placeholder="Judul nilai" />
                  </div>
                  <textarea value={val.description} onChange={(e) => handleValueChange(index, "description", e.target.value)} rows={2} className="admin-input resize-none text-sm" />
                </div>
              );
            })}
          </div>
        </div>

        {/* Legal Documents */}
        <div className="admin-card p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-bold text-base">Dokumen Legal</h2>
            <button type="button" onClick={handleAddDocument} className="btn-admin-secondary text-xs">+ Tambah Dokumen</button>
          </div>
          <div className="space-y-3">
            {form.legalDocuments.map((doc, index) => (
              <div key={doc.id} className="flex gap-3 p-4 border border-border rounded-lg items-center relative group">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 flex-1 pr-6">
                  <input value={doc.name} onChange={(e) => handleDocumentChange(index, "name", e.target.value)} placeholder="Nama dokumen" className="admin-input text-sm" />
                  <input value={doc.number} onChange={(e) => handleDocumentChange(index, "number", e.target.value)} placeholder="Nomor dokumen" className="admin-input text-sm" />
                  <input value={doc.issuedBy} onChange={(e) => handleDocumentChange(index, "issuedBy", e.target.value)} placeholder="Diterbitkan oleh" className="admin-input text-sm" />
                  <input type="date" value={doc.issuedDate} onChange={(e) => handleDocumentChange(index, "issuedDate", e.target.value)} className="admin-input text-sm" />
                </div>
                <button type="button" onClick={() => handleRemoveDocument(index)} className="absolute top-1/2 -translate-y-1/2 right-2 p-1.5 bg-red-50 text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
