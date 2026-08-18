import { Metadata } from "next";
import Link from "next/link";
import { getCompanyProfile } from "@/lib/actions/company";
import { getContactInfo } from "@/lib/actions/contact";

export const metadata: Metadata = {
  title: "Kebijakan Privasi | Toko Manur",
  description: "Pemberitahuan privasi global dan kebijakan privasi untuk pelanggan Toko Manur.",
};

export default async function PrivacyPolicyPage() {
  const profileRes = await getCompanyProfile();
  const privacyPolicy = profileRes.success ? profileRes.data.privacyPolicy : null;
  
  const contactRes = await getContactInfo();
  const contactEmail = contactRes.success && contactRes.data.email ? contactRes.data.email : "halo@tokomanurbaby.id";

  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl pt-32">
      <div className="mb-10 text-center">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4">Pemberitahuan Privasi Global</h1>
        <p className="text-slate-500">
          Terakhir Direvisi: {new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose prose-slate max-w-none space-y-6 text-slate-700 leading-relaxed whitespace-pre-wrap">
        {privacyPolicy ? (
          <div dangerouslySetInnerHTML={{ __html: privacyPolicy }} />
        ) : (
          <>
            <p>
              Toko Manur menghargai privasi setiap pengunjung website kami. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi Anda saat Anda mengunjungi website Toko Manur, yang berfungsi sebagai katalog produk popok dan perlengkapan bayi kami.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Informasi yang Dikumpulkan</h2>
            <p>Kami mungkin mengumpulkan informasi berikut ketika Anda berinteraksi dengan website atau menghubungi kami:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Informasi Kontak:</strong> Nama, alamat email, dan nomor WhatsApp/telepon yang Anda berikan secara sukarela saat menghubungi kami.</li>
              <li><strong>Data Teknis:</strong> Informasi seperti alamat IP, jenis browser, perangkat yang digunakan, dan aktivitas penggunaan website melalui sistem analitik/cookies teknis standar.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Penggunaan Informasi</h2>
            <p>Informasi yang kami kumpulkan digunakan untuk tujuan berikut:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Menjawab pertanyaan dan memberikan dukungan pelanggan.</li>
              <li>Memberikan informasi terkait produk Toko Manur.</li>
              <li>Memproses komunikasi atau pemesanan yang dilakukan melalui jalur komunikasi WhatsApp.</li>
              <li>Meningkatkan kualitas website dan layanan kami.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Marketplace Pihak Ketiga</h2>
            <p>
              Website Toko Manur berfungsi mengarahkan Anda ke toko resmi kami di marketplace pihak ketiga, seperti <strong>Shopee, Tokopedia, TikTok Shop, dan Akulaku</strong>. Kami tidak memproses pembayaran, alamat pengiriman, atau checkout langsung di website ini.
            </p>
            <p>
              Data apa pun yang Anda masukkan saat melakukan pembelian di platform tersebut sepenuhnya tunduk pada Kebijakan Privasi dari masing-masing platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">WhatsApp</h2>
            <p>
              Ketika Anda menghubungi kami melalui tombol WhatsApp, komunikasi akan berlangsung melalui layanan WhatsApp. Data yang diberikan melalui percakapan digunakan untuk membantu kebutuhan Anda.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Cookies & Teknologi Pelacakan</h2>
            <p>
              Website kami menggunakan cookies teknis untuk memastikan website berfungsi dengan baik.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Penyimpanan dan Keamanan Data</h2>
            <p>
              Kami menjaga data dengan langkah keamanan yang wajar. Namun, perlu diketahui bahwa tidak ada transmisi data melalui internet yang dapat dijamin aman 100%.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Berbagi Data</h2>
            <p>Kami <strong>tidak menjual</strong> data pribadi Anda. Kami hanya dapat membagikan informasi kepada:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Penyedia layanan yang diperlukan untuk operasional website.</li>
              <li>Pihak marketplace atau WhatsApp ketika pengguna sendiri berpindah ke platform tersebut.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Hak Pengguna</h2>
            <p>Anda berhak untuk:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Meminta informasi mengenai data yang dimiliki.</li>
              <li>Meminta koreksi atau penghapusan data.</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Perubahan Kebijakan Privasi</h2>
            <p>
              Toko Manur berhak mengubah Kebijakan Privasi ini. Perubahan berlaku segera setelah dipublikasikan.
            </p>

            <h2 className="text-2xl font-bold text-slate-900 mt-10 mb-4">Kontak</h2>
            <p>
              Jika Anda memiliki pertanyaan, silakan hubungi kami melalui:
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
