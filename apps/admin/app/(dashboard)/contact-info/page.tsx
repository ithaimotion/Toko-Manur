"use client";

import { useEffect, useState } from "react";
import { Save, Loader2, MapPin, Mail, Phone, Clock, Map } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/ui/PageHeader";
import { getContactInfo, getContactMessages, updateContactInfo } from "@/app/actions/contact";
import type { ContactInfo, ContactMessage } from "@toko-manur/types";

export default function AdminContactInfoPage() {
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(true);
  // status moved to toast notifications
  const [form, setForm] = useState<ContactInfo>({
    id: "",
    address: "",
    email: "",
    whatsapp: "",
    whatsappMessage: "",
    googleMapsEmbed: "",
    latitude: "",
    longitude: "",
    businessHours: "",
    updatedAt: new Date().toISOString(),
  });
  const [messages, setMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    async function loadContact() {
      const [contactResponse, messagesResponse] = await Promise.all([getContactInfo(), getContactMessages()]);

      if (contactResponse.success) {
        setForm({
          ...contactResponse.data,
          whatsappMessage: contactResponse.data.whatsappMessage ?? "",
          googleMapsEmbed: contactResponse.data.googleMapsEmbed ?? "",
          latitude: contactResponse.data.latitude ?? "",
          longitude: contactResponse.data.longitude ?? "",
          businessHours: contactResponse.data.businessHours ?? "",
        });
      }

      if (messagesResponse.success) {
        setMessages(messagesResponse.data);
      }

      setLoading(false);
      setMessagesLoading(false);
    }

    loadContact();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name === "googleMapsEmbed") {
      let lat = form.latitude;
      let lng = form.longitude;
      
      const srcMatch = value.match(/src=["']([^"']+)["']/);
      const url = srcMatch ? srcMatch[1] : value;
      
      if (url.includes("/maps/embed")) {
        let match = url.match(/!3d([0-9.-]+)!4d([0-9.-]+)/);
        if (match) {
          lat = match[1];
          lng = match[2];
        } else {
          match = url.match(/!2d([0-9.-]+)!3d([0-9.-]+)/);
          if (match) {
            lng = match[1];
            lat = match[2];
          }
        }
      }
      
      setForm((p) => ({ ...p, [name]: value, latitude: lat || "", longitude: lng || "" }));
    } else {
      setForm((p) => ({ ...p, [name]: value }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await updateContactInfo(form);
      if (response.success) {
        toast.success("Informasi kontak berhasil disimpan.");
      } else {
        toast.error(response.error || "Gagal menyimpan informasi kontak.");
      }
    } catch (err) {
      toast.error("Gagal menyimpan informasi kontak.");
    }
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

      {loading ? (
        <div className="admin-card p-6 text-sm text-muted-foreground">Memuat data kontak...</div>
      ) : (
        <div className="space-y-4">
          {/* notifications are shown via toast */}
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
                  <p className="text-xs text-muted-foreground mt-1">Format: kode negara + nomor (tanpa +). Cth: 62087718676718</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-label">Latitude</label>
                  <input name="latitude" value={form.latitude || ""} onChange={handleChange} placeholder="-6.240000" className="admin-input" />
                </div>
                <div>
                  <label className="admin-label">Longitude</label>
                  <input name="longitude" value={form.longitude || ""} onChange={handleChange} placeholder="106.790000" className="admin-input" />
                </div>
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

          <div className="admin-card p-6 space-y-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="font-bold text-base">Pesan dari Landing Page</h2>
                <p className="text-sm text-muted-foreground">Daftar setiap pesan yang dikirim melalui form kontak</p>
              </div>
              <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                {messages.length} pesan
              </span>
            </div>

            {messagesLoading ? (
              <div className="text-sm text-muted-foreground">Memuat pesan...</div>
            ) : messages.length === 0 ? (
              <div className="rounded-lg border border-dashed border-border p-4 text-sm text-muted-foreground">
                Belum ada pesan yang dikirim dari landing page.
              </div>
            ) : (
              <div className="overflow-hidden rounded-lg border border-border">
                <div className="grid grid-cols-[2fr_1.2fr_1fr] bg-muted/60 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  <div>Pengirim</div>
                  <div>Subjek</div>
                  <div>Waktu</div>
                </div>
                <div className="divide-y divide-border">
                  {messages.map((message, index) => (
                    <div key={message.id} className="grid grid-cols-[2fr_1.2fr_1fr] items-start gap-3 px-4 py-3 text-sm">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">{index + 1}.</span>
                          <div>
                            <p className="font-medium text-foreground">{message.name}</p>
                            <p className="text-xs text-muted-foreground">{message.email}</p>
                          </div>
                        </div>
                        {message.phone ? (
                          <p className="mt-1 text-xs text-muted-foreground">{message.phone}</p>
                        ) : null}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-foreground">{message.subject}</p>
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{message.message}</p>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleString("id-ID")}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
