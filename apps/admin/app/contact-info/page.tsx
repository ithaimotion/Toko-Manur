"use client";

import { useState } from "react";
import { Save, Loader2, MapPin, Mail, Phone, Clock, Map } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { mockContactInfo } from "@toko-manur/mock-data";

export default function AdminContactInfoPage() {
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ ...mockContactInfo });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
  };

  return (
    <div>
      <PageHeader
        title="Informasi Kontak"
        description="Kelola detail kontak yang tampil di website"
        breadcrumb={[{ label: "Dashboard", href: "/" }, { label: "Info Kontak" }]}
        action={
          <button onClick={handleSave} disabled={saving} className="btn-admin-primary">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan
          </button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Address & Contact */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="font-bold text-base flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" /> Alamat & Kontak
          </h2>
          <div>
            <label className="admin-label">Alamat Lengkap</label>
            <textarea name="address" value={form.address} onChange={handleChange} rows={3} className="admin-input resize-none" />
          </div>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label className="admin-label flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} className="admin-input" />
            </div>
            <div>
              <label className="admin-label flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Nomor WhatsApp</label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-muted border border-r-0 border-input rounded-l-lg text-sm text-muted-foreground">+</span>
                <input name="whatsapp" value={form.whatsapp} onChange={handleChange} placeholder="6281234567890" className="admin-input rounded-l-none" />
              </div>
              <p className="text-xs text-muted-foreground mt-1">Format: kode negara + nomor (tanpa +). Cth: 6281234567890</p>
            </div>
            <div>
              <label className="admin-label">Pesan Awal WhatsApp (opsional)</label>
              <textarea name="whatsappMessage" value={form.whatsappMessage} onChange={handleChange} rows={2} placeholder="Halo, saya ingin bertanya..." className="admin-input resize-none" />
            </div>
            <div>
              <label className="admin-label flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Jam Operasional</label>
              <input name="businessHours" value={form.businessHours} onChange={handleChange} placeholder="Senin – Sabtu: 08.00 – 17.00 WIB" className="admin-input" />
            </div>
          </div>
        </div>

        {/* Google Maps */}
        <div className="admin-card p-6 space-y-5">
          <h2 className="font-bold text-base flex items-center gap-2">
            <Map className="w-4 h-4 text-primary" /> Google Maps
          </h2>
          <div>
            <label className="admin-label">URL Google Maps</label>
            <input name="googleMapsUrl" value={form.googleMapsUrl} onChange={handleChange} placeholder="https://maps.google.com/..." className="admin-input" />
          </div>
          <div>
            <label className="admin-label">Google Maps Embed Code</label>
            <textarea name="googleMapsEmbed" value={form.googleMapsEmbed} onChange={handleChange} rows={5} placeholder='<iframe src="https://www.google.com/maps/embed?..." ...>' className="admin-input resize-none font-mono text-xs" />
            <p className="text-xs text-muted-foreground mt-1">
              Dapatkan kode embed dari Google Maps &gt; Share &gt; Embed a map
            </p>
          </div>
          {form.googleMapsEmbed && (
            <div className="rounded-xl overflow-hidden border border-border h-40">
              <iframe src={form.googleMapsEmbed} width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
