import { Metadata } from "next";
import { getCompanyProfile } from "@/lib/actions/company";
import { getContactInfo } from "@/lib/actions/contact";

export const metadata: Metadata = {
  title: "Syarat dan Ketentuan | Toko Manur",
  description: "Syarat dan Ketentuan layanan pelanggan Toko Manur.",
};

export default async function TermsPage() {
  const profileRes = await getCompanyProfile();
  const termsOfService = profileRes.success ? profileRes.data.termsOfService : null;
  
  const contactRes = await getContactInfo();
  const contactEmail = contactRes.success && contactRes.data.email ? contactRes.data.email : "halo@tokomanurbaby.id";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Syarat dan Ketentuan</h1>
        <p className="text-slate-500">
          Terakhir Direvisi: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
        {termsOfService ? (
          <div dangerouslySetInnerHTML={{ __html: termsOfService }} />
        ) : (
          <>
            <p>
              Selamat datang di Toko Manur. Syarat dan Ketentuan berikut mengatur penggunaan Anda atas website Toko Manur serta layanan yang kami sediakan. Dengan mengakses atau menggunakan website ini, Anda setuju untuk terikat oleh Syarat dan Ketentuan ini.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">1. Layanan Kami</h2>
            <p>
              Toko Manur menyediakan katalog produk popok dan perlengkapan bayi berkualitas. Website ini berfungsi sebagai media informasi produk dan mengarahkan Anda untuk melakukan transaksi pembelian secara aman melalui platform marketplace resmi kami (Shopee, Tokopedia, TikTok Shop, Akulaku) atau melalui layanan chat WhatsApp.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">2. Ketentuan Transaksi</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Pembelian:</strong> Seluruh transaksi pembayaran dan pengiriman barang diproses secara langsung oleh platform marketplace pihak ketiga atau melalui kesepakatan di WhatsApp, bukan melalui sistem internal website ini.</li>
              <li><strong>Ketersediaan Produk:</strong> Informasi ketersediaan produk dan harga di website ini dapat berubah sewaktu-waktu. Harga final adalah harga yang tertera pada marketplace saat Anda melakukan <em>checkout</em>.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">3. Penggunaan Website</h2>
            <p>Dengan menggunakan website ini, Anda setuju untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Tidak menggunakan website ini untuk tujuan yang melanggar hukum.</li>
              <li>Tidak menyalin, mendistribusikan, atau memodifikasi materi dari website ini tanpa izin tertulis dari Toko Manur.</li>
              <li>Memberikan informasi yang akurat (seperti email atau nomor WhatsApp) ketika menghubungi kami.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">4. Tautan ke Situs Pihak Ketiga</h2>
            <p>
              Website kami mungkin berisi tautan ke situs web atau layanan pihak ketiga yang tidak dimiliki atau dikontrol oleh Toko Manur (misalnya, marketplace). Kami tidak bertanggung jawab atas konten, kebijakan privasi, atau praktik situs web pihak ketiga mana pun.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">5. Perubahan Syarat dan Ketentuan</h2>
            <p>
              Toko Manur berhak untuk memperbarui atau mengubah Syarat dan Ketentuan ini kapan saja tanpa pemberitahuan sebelumnya. Kami menyarankan Anda untuk meninjau halaman ini secara berkala untuk mengetahui perubahan apa pun.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">6. Kontak Kami</h2>
            <p>
              Jika Anda memiliki pertanyaan tentang Syarat dan Ketentuan ini, silakan hubungi kami melalui:
            </p>
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 mt-4">
              <p className="mb-2"><strong>Email:</strong> <a href={`mailto:${contactEmail}`} className="text-primary hover:underline">{contactEmail}</a></p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
