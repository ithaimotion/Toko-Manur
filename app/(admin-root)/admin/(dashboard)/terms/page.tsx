"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, FileText } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";

export default function AdminTermsPage() {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(() => ({
    about: "",
    aboutImage: "",
    vision: "",
    mission: "",
    brandStory: "",
    founded: "",
    privacyPolicy: "",
    termsOfService: "",
    values: [] as any[],
    legalDocuments: [] as any[],
  }));

  const { data: company, isLoading } = useQuery({
    queryKey: ["companyProfile"],
    queryFn: async () => {
      const res = await fetch('/api/company');
      const json = await res.json();
      return json.success ? json.data : null;
    }
  });

  useEffect(() => {
    if (company) {
      setForm({
        about: company.about || "",
        aboutImage: company.aboutImage || "",
        vision: company.vision || "",
        mission: Array.isArray(company.mission) ? company.mission.join('\n') : (company.mission || '').toString(),
        brandStory: company.brandStory || "",
        founded: company.founded || "",
        privacyPolicy: company.privacyPolicy || "",
        termsOfService: company.termsOfService || `<p>
  Selamat datang di Toko Manur. Syarat dan Ketentuan berikut mengatur penggunaan Anda atas website Toko Manur serta layanan yang kami sediakan. Dengan mengakses atau menggunakan website ini, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini.
</p>

<h2>1. Layanan Kami</h2>
<p>
  Toko Manur menyediakan katalog produk popok dan perlengkapan bayi berkualitas. Website ini berfungsi sebagai media informasi produk dan mengarahkan Anda untuk melakukan transaksi pembelian secara aman melalui platform marketplace resmi kami (Shopee, Tokopedia, TikTok Shop, Akulaku) atau melalui layanan chat WhatsApp.
</p>

<h2>2. Ketentuan Transaksi</h2>
<ul>
  <li><strong>Pembelian:</strong> Seluruh transaksi pembayaran dan pengiriman barang diproses secara langsung oleh platform marketplace pihak ketiga atau melalui kesepakatan di WhatsApp, bukan melalui sistem internal website ini.</li>
  <li><strong>Ketersediaan Produk:</strong> Informasi ketersediaan produk dan harga di website ini dapat berubah sewaktu-waktu. Harga final adalah harga yang tertera pada marketplace saat Anda melakukan <em>checkout</em>.</li>
</ul>

<h2>3. Penggunaan Website</h2>
<p>Dengan menggunakan website ini, Anda setuju untuk:</p>
<ul>
  <li>Tidak menggunakan website ini untuk tujuan yang melanggar hukum.</li>
  <li>Tidak menyalin, mendistribusikan, atau memodifikasi materi dari website ini tanpa izin tertulis dari Toko Manur.</li>
  <li>Memberikan informasi yang akurat (seperti email atau nomor WhatsApp) ketika menghubungi kami.</li>
</ul>

<h2>4. Tautan ke Situs Pihak Ketiga</h2>
<p>
  Website kami mungkin berisi tautan ke situs web atau layanan pihak ketiga yang tidak dimiliki atau dikontrol oleh Toko Manur (misalnya, marketplace). Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs web pihak ketiga mana pun.
</p>

<h2>5. Perubahan Syarat dan Ketentuan</h2>
<p>
  Toko Manur berhak untuk memperbarui atau mengubah Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan apa pun.
</p>

<h2>6. Kontak Kami</h2>
<p>
  Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui email yang tertera di halaman kontak atau langsung menghubungi WhatsApp resmi kami.
</p>`,
        values: (company.values || []).map((v: any) => ({ ...v })),
        legalDocuments: (company.legalDocuments || []).map((d: any) => ({ ...d })),
      });
    }
  }, [company]);

  const saveMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch("/api/company", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error || "Gagal menyimpan.");
      return json;
    },
    onSuccess: () => {
      toast.success("Syarat & Ketentuan berhasil disimpan.");
      queryClient.invalidateQueries({ queryKey: ["companyProfile"] });
    },
    onError: (error: any) => toast.error(error.message || "Gagal menyimpan.")
  });

  const handleSave = () => {
    const payload = {
      about: form.about,
      aboutImage: form.aboutImage,
      vision: form.vision,
      mission: form.mission.split("\n").filter(Boolean),
      brandStory: form.brandStory,
      founded: form.founded,
      privacyPolicy: form.privacyPolicy,
      termsOfService: form.termsOfService,
      values: form.values,
      legalDocuments: form.legalDocuments,
    };
    saveMutation.mutate(payload);
  };

  return (
    <div>
      <PageHeader
        title="Syarat dan Ketentuan"
        description="Kelola teks Syarat & Ketentuan (Terms and Conditions) yang tampil di halaman frontend."
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Syarat & Ketentuan" }]}
        action={
          <button onClick={handleSave} disabled={saveMutation.isPending || isLoading} className="btn-admin-primary">
            {saveMutation.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Simpan Perubahan
          </button>
        }
      />

      {isLoading ? (
        <div className="mt-6">
          <TableSkeleton columns={1} rows={10} showActions={false} />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 mt-6">
        <div className="admin-card p-6">
          <div className="flex items-center gap-2 mb-5">
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-bold text-base">Konten Syarat dan Ketentuan</h2>
          </div>
          <div className="border border-border rounded-lg overflow-hidden">
            <RichTextEditor
              value={form.termsOfService}
              onChange={(val) => setForm(p => ({ ...p, termsOfService: val }))}
              placeholder="Tuliskan Syarat dan Ketentuan perusahaan di sini..."
            />
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Gunakan editor di atas untuk mengatur format teks Syarat & Ketentuan (seperti huruf tebal, daftar, dan tautan).
          </p>
        </div>
      </div>
      )}
    </div>
  );
}
