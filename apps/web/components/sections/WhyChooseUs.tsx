import { ShieldCheck, Truck, Heart, HeadphonesIcon, Clock, Users } from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "100% Produk Original",
    description: "Semua popok dan perlengkapan bayi kami dijamin asli dari distributor resmi. Aman untuk si kecil.",
    color: "bg-amber-100 text-amber-600",
  },
  {
    icon: Truck,
    title: "Pengiriman Instan",
    description: "Kehabisan popok mendadak? Kami menyediakan pengiriman instan 2 jam sampai untuk wilayah kota.",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: HeadphonesIcon,
    title: "Konsultasi Bunda",
    description: "Tim ahli kami siap membantu Bunda memilih ukuran popok atau produk perawatan kulit yang tepat.",
    color: "bg-emerald-100 text-emerald-600",
  },
  {
    icon: Heart,
    title: "Lembut & Aman",
    description: "Kami hanya menjual produk yang sudah teruji klinis, bebas bahan kimia berbahaya dan anti ruam.",
    color: "bg-purple-100 text-purple-600",
  },
  {
    icon: Clock,
    title: "Buka Setiap Hari",
    description: "Toko kami buka setiap hari termasuk tanggal merah, siap sedia di saat darurat kehabisan stok.",
    color: "bg-teal-100 text-teal-600",
  },
  {
    icon: Users,
    title: "Komunitas Parenting",
    description: "Bergabung dengan ribuan Bunda lainnya di komunitas kami untuk berbagi tips dan pengalaman.",
    color: "bg-rose-100 text-rose-600",
  },
];

export function WhyChooseUs() {
  return (
    <section className="section bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="badge-primary inline-flex mb-4">
            <Heart className="w-3.5 h-3.5 mr-1.5" />
            Keunggulan Kami
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Mengapa Pilih{" "}
            <span className="gradient-text">Toko Manur Baby Care?</span>
          </h2>
          <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
            Kami hadir sebagai sahabat terpercaya yang siap membantu Bunda merawat si kecil dengan sepenuh hati
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map(({ icon: Icon, title, description, color }, idx) => (
            <div
              key={title}
              className="group p-6 rounded-2xl border border-border hover:border-primary-200 hover:shadow-card-hover transition-all duration-300 bg-white hover:bg-primary-50/30"
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${color} group-hover:scale-110 transition-transform duration-300`}
              >
                <Icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
