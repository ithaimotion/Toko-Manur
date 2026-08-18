"use client";

import { useState, useEffect } from "react";
import { Save, Loader2, Shield } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { RichTextEditor } from "@/components/admin/ui/RichTextEditor";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { TableSkeleton } from "@/components/admin/ui/TableSkeleton";

export default function AdminPrivacyPolicyPage() {
  const queryClient = useQueryClient();
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
        privacyPolicy: company.privacyPolicy || `<p>
  Toko Manur menghargai privasi setiap pengunjung website kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda mengunjungi website Toko Manur, yang berfungsi sebagai katalog produk popok dan perlengkapan bayi kami.
</p>

<h2>Informasi yang Dikumpulkan</h2>
<p>Kami mungkin mengumpulkan informasi berikut ketika Anda berinteraksi dengan website atau menghubungi kami:</p>
<ul>
  <li><strong>Informasi Kontak:</strong> Nama, alamat email, dan nomor WhatsApp/telepon yang Anda berikan secara sukarela saat menghubungi kami.</li>
  <li><strong>Data Teknis:</strong> Informasi seperti alamat IP, jenis browser, perangkat yang digunakan, dan aktivitas penggunaan website melalui sistem analitik/cookies teknis standar.</li>
</ul>

<h2>Penggunaan Informasi</h2>
<p>Informasi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
<ul>
  <li>Menjawab pertanyaan dan memberikan dukungan pelanggan.</li>
  <li>Memberikan informasi terkait produk Toko Manur.</li>
  <li>Memproses komunikasi atau pemesanan yang dilakukan melalui jalur komunikasi WhatsApp.</li>
  <li>Meningkatkan kualitas website dan layanan kami.</li>
</ul>

<h2>Marketplace Pihak Ketiga</h2>
<p>
  Website Toko Manur berfungsi mengarahkan Anda ke toko resmi kami di marketplace pihak ketiga, seperti <strong>Shopee, Tokopedia, TikTok Shop, dan Akulaku</strong>. Kami tidak memproses pembayaran, alamat pengiriman, atau checkout langsung di website ini.
</p>
<p>
  Data apa pun yang Anda masukkan saat melakukan pembelian di platform tersebut sepenuhnya tunduk pada Kebijakan Privasi dari masing-masing platform.
</p>

<h2>WhatsApp</h2>
<p>
  Ketika Anda menghubungi kami melalui tombol WhatsApp, komunikasi akan berlangsung melalui layanan WhatsApp. Data yang diberikan melalui percakapan digunakan untuk membantu kebutuhan Anda.
</p>

<h2>Cookies & Teknologi Pelacakan</h2>
<p>
  Website kami menggunakan cookies teknis untuk memastikan website berfungsi dengan baik.
</p>

<h2>Penyimpanan dan Keamanan Data</h2>
<p>
  Kami menjaga data dengan langkah keamanan yang wajar. Namun, perlu diketahui bahwa tidak ada transmisi data melalui internet yang dapat dijamin aman 100%.
</p>

<h2>Berbagi Data</h2>
<p>Kami <strong>tidak menjual</strong> data pribadi Anda. Kami hanya dapat membagikan informasi kepada:</p>
<ul>
  <li>Penyedia layanan yang diperlukan untuk operasional website.</li>
  <li>Pihak marketplace atau WhatsApp ketika pengguna sendiri berpindah ke platform tersebut.</li>
</ul>

<h2>Hak Pengguna</h2>
<p>Anda berhak untuk:</p>
<ul>
  <li>Meminta informasi mengenai data yang dimiliki.</li>
  <li>Meminta koreksi atau penghapusan data.</li>
</ul>

<h2>Perubahan Kebijakan Privasi</h2>
<p>
  Toko Manur berhak mengubah Kebijakan Privasi ini. Perubahan berlaku segera setelah dipublikasikan.
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
      toast.success("Kebijakan Privasi berhasil disimpan.");
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
      values: form.values,
      legalDocuments: form.legalDocuments,
    };
    saveMutation.mutate(payload);
  };

  return (
    <div>
      <PageHeader
        title="Kebijakan Privasi"
        description="Kelola teks kebijakan privasi yang tampil di halaman frontend."
        breadcrumb={[{ label: "Dasbor", href: "/admin" }, { label: "Kebijakan Privasi" }]}
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
              <Shield className="w-5 h-5 text-primary" />
              <h2 className="font-bold text-base">Konten Kebijakan Privasi</h2>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <RichTextEditor
                value={form.privacyPolicy}
                onChange={(val) => setForm(p => ({ ...p, privacyPolicy: val }))}
                placeholder="Tuliskan Kebijakan Privasi perusahaan di sini..."
              />
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Gunakan editor di atas untuk mengatur format teks Kebijakan Privasi (seperti huruf tebal, daftar, dan tautan).
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
