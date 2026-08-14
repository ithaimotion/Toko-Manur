import type {
  Product,
  Category,
  Blog,
  Testimonial,
  HeroBanner,
  Promo,
  MarketplaceLink,
  CompanyProfile,
  ContactInfo,
  User,
  SiteSettings,
  BlogAuthor,
} from "@/lib/types";

// ================================
// Categories
// ================================
export const mockCategories: Category[] = [
  {
    id: "cat-1",
    name: "Popok Celana (Pants)",
    slug: "popok-celana",
    description: "Popok model celana yang praktis dan nyaman untuk si kecil yang aktif bergerak",
    image: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=400&h=300&fit=crop",
    productCount: 24,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cat-2",
    name: "Popok Perekat (Tape)",
    slug: "popok-perekat",
    description: "Popok perekat lembut khusus untuk newborn dan bayi dengan kulit sensitif",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=400&h=300&fit=crop",
    productCount: 15,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cat-3",
    name: "Tisu Basah (Wipes)",
    slug: "tisu-basah",
    description: "Tisu basah berbahan aman, non-alkohol untuk membersihkan kulit bayi",
    image: "https://images.unsplash.com/photo-1584984285816-c731e0f06ce8?w=400&h=300&fit=crop",
    productCount: 12,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cat-4",
    name: "Perawatan Kulit Bayi",
    slug: "perawatan-kulit-bayi",
    description: "Baby oil, lotion, diaper cream, dan sabun mandi khusus kulit sensitif bayi",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
    productCount: 30,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cat-5",
    name: "Perlengkapan Menyusui",
    slug: "perlengkapan-menyusui",
    description: "Kebutuhan bunda mulai dari breast pump, kantong ASI, hingga nursing cover",
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=300&fit=crop",
    productCount: 18,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "cat-6",
    name: "Aksesoris & Mainan",
    slug: "aksesoris-mainan",
    description: "Teether, empeng, dan mainan edukasi yang aman untuk perkembangan motorik",
    image: "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=400&h=300&fit=crop",
    productCount: 45,
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
];

// ================================
// Products
// ================================
export const mockProducts: Product[] = [
  {
    id: "prod-1",
    name: "Merries Pants Good Skin XL 26",
    slug: "merries-pants-good-skin-xl-26",
    description:
      "Merries Pants Good Skin diformulasikan khusus dengan permukaan lembut dan sirkulasi udara yang baik. Mencegah iritasi dan ruam pada kulit bayi yang sensitif, serta memiliki daya serap tinggi hingga 5 kali pipis agar si kecil bebas beraktivitas sepanjang hari.",
    shortDescription: "Popok celana lembut dengan sirkulasi udara baik, bebas ruam popok.",
    images: [
      { id: "img-1", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop", alt: "Merries Pants", isPrimary: true },
      { id: "img-2", url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=600&fit=crop", alt: "Kemasan Merries", isPrimary: false },
    ],
    brandId: "cat-1",
    brand: mockCategories[0],
    specifications: [
      { label: "Ukuran", value: "XL (12-19 kg)" },
      { label: "Isi per pack", value: "26 pcs" },
      { label: "Tipe", value: "Celana (Pants)" },
      { label: "Daya Serap", value: "Hingga 5x pipis" },
      { label: "Material", value: "Soft Cotton, Breathable Layer" },
      { label: "Keunggulan", value: "Mencegah ruam popok" },
    ],
    price: 65000,
    isFeatured: true,
    status: "published",
    marketplaceLinks: [
      { platform: "shopee", url: "https://shopee.co.id" },
      { platform: "tokopedia", url: "https://tokopedia.com" },
    ],
    createdAt: "2024-01-15T00:00:00Z",
    updatedAt: "2024-06-10T00:00:00Z",
  },
  {
    id: "prod-2",
    name: "MamyPoko Royal Soft Newborn Tape",
    slug: "mamypoko-royal-soft-newborn-tape",
    description:
      "MamyPoko Tape Royal Soft menghadirkan kelembutan sehalus kapas dengan teknologi penyerapan super cepat. Didesain khusus dengan potongan melengkung pada bagian pusar untuk bayi baru lahir agar pusar yang belum sembuh tidak tergesek.",
    shortDescription: "Popok perekat super lembut khusus newborn dengan perlindungan pusar.",
    images: [
      { id: "img-3", url: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800&h=600&fit=crop", alt: "MamyPoko Newborn", isPrimary: true },
    ],
    brandId: "cat-2",
    brand: mockCategories[1],
    specifications: [
      { label: "Ukuran", value: "Newborn (NB) / s.d 5 kg" },
      { label: "Isi per pack", value: "52 pcs" },
      { label: "Tipe", value: "Perekat (Tape)" },
      { label: "Indikator Pipis", value: "Tersedia" },
      { label: "Perlindungan", value: "Navel Care (Melindungi pusar)" },
    ],
    price: 92000,
    isFeatured: true,
    status: "published",
    marketplaceLinks: [
      { platform: "tokopedia", url: "https://tokopedia.com" },
      { platform: "shopee", url: "https://shopee.co.id" },
      { platform: "tiktok", url: "https://tiktok.com" },
      { platform: "custom", url: "https://akulaku.com" },
    ],
    createdAt: "2024-02-01T00:00:00Z",
    updatedAt: "2024-06-15T00:00:00Z",
  },
  {
    id: "prod-3",
    name: "Sweety Bronze Pants L 30",
    slug: "sweety-bronze-pants-l-30",
    description:
      "Pilihan ekonomis ibu cerdas! Sweety Bronze Pants memberikan perlindungan anti bocor semalaman dengan karet pinggang elastis yang pas di badan bayi. Bahan lembut dan tidak menimbulkan bekas kemerahan di pinggang si kecil.",
    shortDescription: "Popok celana ekonomis anti bocor semalaman dengan karet elastis.",
    images: [
      { id: "img-4", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop", alt: "Sweety Bronze", isPrimary: true },
    ],
    brandId: "cat-1",
    brand: mockCategories[0],
    specifications: [
      { label: "Ukuran", value: "L (11-15 kg)" },
      { label: "Isi per pack", value: "30 pcs" },
      { label: "Tipe", value: "Celana (Pants)" },
      { label: "Keunggulan", value: "Anti bocor 12 jam" },
    ],
    price: 49000,
    isFeatured: false,
    status: "published",
    createdAt: "2024-02-20T00:00:00Z",
    updatedAt: "2024-05-20T00:00:00Z",
  },
  {
    id: "prod-4",
    name: "Pampers Premium Care Pants M 46",
    slug: "pampers-premium-care-pants-m-46",
    description:
      "Pampers Premium Care memberikan perlindungan bintang 5 untuk kulit bayi. Dengan lotion perlindungan kulit dan teknologi Micro-pearls yang mengunci cairan, memastikan kulit bayi tetap kering hingga 12 jam. Ekstra lembut selembut sutra.",
    shortDescription: "Popok celana premium selembut sutra dengan lotion pelindung kulit.",
    images: [
      { id: "img-5", url: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=800&h=600&fit=crop", alt: "Pampers Premium", isPrimary: true },
    ],
    brandId: "cat-1",
    brand: mockCategories[0],
    specifications: [
      { label: "Ukuran", value: "M (7-12 kg)" },
      { label: "Isi per pack", value: "46 pcs" },
      { label: "Tipe", value: "Celana (Pants)" },
      { label: "Material", value: "Silky Soft" },
      { label: "Indikator Urin", value: "Ya" },
    ],
    price: 135000,
    isFeatured: true,
    status: "published",
    createdAt: "2024-03-05T00:00:00Z",
    updatedAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "prod-5",
    name: "Pigeon Baby Wipes Pure Water 82s (Beli 1 Gratis 1)",
    slug: "pigeon-baby-wipes-pure-water",
    description:
      "Tisu basah bayi dengan 99% Pure Water (Air Murni). Formula non-alkohol, bebas paraben dan pewangi. Sangat aman dan lembut untuk membersihkan tangan, mulut, serta area nappy bayi yang sensitif.",
    shortDescription: "Tisu basah 99% pure water, bebas alkohol dan paraben.",
    images: [
      { id: "img-6", url: "https://images.unsplash.com/photo-1584984285816-c731e0f06ce8?w=800&h=600&fit=crop", alt: "Pigeon Wipes", isPrimary: true },
    ],
    brandId: "cat-3",
    brand: mockCategories[2],
    specifications: [
      { label: "Isi Kemasan", value: "82 Lembar x 2 Pack" },
      { label: "Kandungan Utama", value: "99% Pure Water" },
      { label: "Alkohol", value: "0%" },
      { label: "Aroma", value: "Unscented (Tanpa Pewangi)" },
    ],
    price: 32000,
    isFeatured: false,
    status: "published",
    createdAt: "2024-03-15T00:00:00Z",
    updatedAt: "2024-05-15T00:00:00Z",
  },
  {
    id: "prod-6",
    name: "Sebamed Baby Rash Cream 100ml",
    slug: "sebamed-baby-rash-cream-100ml",
    description:
      "Krim pelindung ruam popok dengan pH 5.5 yang ideal untuk kulit bayi. Mengandung Titanium Dioxide dan Panthenol untuk melindungi dari iritasi ekskresi dan merangsang proses penyembuhan kulit.",
    shortDescription: "Krim anti ruam popok teruji klinis dengan pH 5.5.",
    images: [
      { id: "img-7", url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop", alt: "Sebamed Rash Cream", isPrimary: true },
    ],
    brandId: "cat-4",
    brand: mockCategories[3],
    specifications: [
      { label: "Volume", value: "100 ml" },
      { label: "Kandungan Aktif", value: "Panthenol, Titanium Dioxide" },
      { label: "pH", value: "5.5" },
      { label: "Saran Penggunaan", value: "Dioleskan tiap ganti popok" },
    ],
    price: 185000,
    isFeatured: true,
    status: "published",
    createdAt: "2024-04-01T00:00:00Z",
    updatedAt: "2024-06-20T00:00:00Z",
  },
  {
    id: "prod-7",
    name: "Cetaphil Baby Gentle Wash & Shampoo 400ml",
    slug: "cetaphil-baby-gentle-wash-shampoo",
    description:
      "Pembersih 2-in-1 dari ujung rambut hingga ujung kaki. Diperkaya dengan ekstrak Calendula organik yang menenangkan kulit bayi, bebas pedih di mata, hypoallergenic, dan teruji oleh dermatologis.",
    shortDescription: "Sabun dan sampo bayi lembut dengan ekstrak Calendula.",
    images: [
      { id: "img-8", url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop", alt: "Cetaphil Baby Wash", isPrimary: true },
    ],
    brandId: "cat-4",
    brand: mockCategories[3],
    specifications: [
      { label: "Volume", value: "400 ml" },
      { label: "Keunggulan", value: "Tear-free (Tidak perih di mata)" },
      { label: "Kandungan", value: "Organik Calendula" },
      { label: "Tipe Kulit", value: "Semua jenis kulit, Kulit Sensitif" },
    ],
    price: 145000,
    isFeatured: false,
    status: "published",
    createdAt: "2024-04-10T00:00:00Z",
    updatedAt: "2024-06-05T00:00:00Z",
  },
  {
    id: "prod-8",
    name: "Spectra Breastpump S1 Plus Hospital Grade",
    slug: "spectra-breastpump-s1-plus",
    description:
      "Pompa ASI elektrik kelas rumah sakit dengan baterai rechargeable. Fitur let-down massage untuk menstimulasi LDR, sistem closed-system higienis, dan layar digital yang menampilkan durasi serta mode hisapan.",
    shortDescription: "Pompa ASI elektrik Hospital Grade rechargeable, hisapan lembut.",
    images: [
      { id: "img-9", url: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=800&h=600&fit=crop", alt: "Spectra Breastpump", isPrimary: true },
    ],
    brandId: "cat-5",
    brand: mockCategories[4],
    specifications: [
      { label: "Tipe", value: "Elektrik (Double Pump)" },
      { label: "Daya", value: "Baterai Rechargeable / Adaptor AC" },
      { label: "Fitur", value: "Night Light, Timer, Massage Mode" },
      { label: "Garansi", value: "2 Tahun Resmi Spectra Indonesia" },
    ],
    price: 2550000,
    isFeatured: false,
    status: "published",
    createdAt: "2024-05-01T00:00:00Z",
    updatedAt: "2024-06-10T00:00:00Z",
  },
];

// ================================
// Blog Authors
// ================================
const mockAuthors: BlogAuthor[] = [
  { id: "auth-1", name: "Bunda Ayu", avatar: "https://i.pravatar.cc/150?img=1", role: "Parenting Expert" },
  { id: "auth-2", name: "Dr. Citra Sari, Sp.A", avatar: "https://i.pravatar.cc/150?img=5", role: "Dokter Anak" },
  { id: "auth-3", name: "Rina Maharani", avatar: "https://i.pravatar.cc/150?img=9", role: "Lactation Counselor" },
];

// ================================
// Blogs
// ================================
export const mockBlogs: Blog[] = [
  {
    id: "blog-1",
    title: "5 Cara Ampuh Mencegah Ruam Popok Pada Kulit Sensitif Bayi",
    slug: "cara-mencegah-ruam-popok-bayi",
    excerpt: "Ruam popok adalah masalah umum yang bikin bayi rewel. Simak 5 langkah sederhana dari dokter anak untuk mencegah dan merawat kulit sensitif si kecil.",
    content: `<h2>Mengapa Ruam Popok Terjadi?</h2><p>Ruam popok biasanya disebabkan oleh kontak terlalu lama dengan urin atau tinja, gesekan popok, atau alergi terhadap bahan tertentu. Kulit bayi yang masih tipis sangat rentan mengalami iritasi.</p><h2>5 Tips Mencegah Ruam</h2><p>1. Ganti popok setiap 3-4 jam sekali, walau belum terlalu penuh. 2. Bersihkan dengan kapas dan air hangat, hindari tisu basah beralkohol. 3. Pastikan area nappy benar-benar kering sebelum memakaikan popok baru. 4. Gunakan diaper cream sebagai pelindung (barrier). 5. Beri waktu 'bebas popok' (diaper-free time) minimal 15 menit sehari agar kulit bernapas.</p>`,
    coverImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&h=630&fit=crop",
    author: mockAuthors[1],
    categoryId: "cat-4",
    categoryName: "Perawatan Kulit Bayi",
    tags: ["ruam popok", "kesehatan bayi", "diaper rash"],
    seoTitle: "5 Cara Ampuh Mencegah Ruam Popok Pada Bayi - Toko Manur",
    seoDescription: "Panduan dari dokter anak tentang cara mengatasi dan mencegah ruam popok pada bayi dengan kulit sensitif.",
    readingTime: 5,
    status: "published",
    publishedAt: "2024-06-01T08:00:00Z",
    createdAt: "2024-05-28T00:00:00Z",
    updatedAt: "2024-06-01T08:00:00Z",
  },
  {
    id: "blog-2",
    title: "Panduan Memilih Ukuran Popok Bayi Sesuai Berat Badan",
    slug: "panduan-memilih-ukuran-popok",
    excerpt: "Sering bocor atau bayi berbekas merah di perut? Bisa jadi ukuran popoknya kurang pas. Berikut panduan lengkap memilih ukuran yang tepat.",
    content: `<h2>Tanda Popok Sudah Kekecilan</h2><p>Jika Bunda melihat ada bekas karet kemerahan di pinggang atau paha bayi, sering terjadi bocor samping, atau perekat popok sulit dikancingkan ke bagian tengah, itu tandanya si kecil butuh naik size (ukuran).</p>`,
    coverImage: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1200&h=630&fit=crop",
    author: mockAuthors[0],
    categoryId: "cat-1",
    categoryName: "Popok Celana (Pants)",
    tags: ["ukuran popok", "tips bunda", "newborn"],
    readingTime: 7,
    status: "published",
    publishedAt: "2024-05-20T09:00:00Z",
    createdAt: "2024-05-18T00:00:00Z",
    updatedAt: "2024-05-20T09:00:00Z",
  },
  {
    id: "blog-3",
    title: "Perbedaan Popok Celana (Pants) vs Perekat (Tape): Mana yang Terbaik?",
    slug: "perbedaan-popok-celana-vs-perekat",
    excerpt: "Bunda baru mungkin bingung memilih antara popok tipe perekat atau tipe celana. Kapan sebaiknya pakai perekat dan kapan beralih ke tipe celana?",
    content: `<h2>Kelebihan Popok Perekat</h2><p>Popok perekat (Tape) sangat ideal untuk Newborn (Bayi baru lahir) hingga usia 3-4 bulan. Mengapa? Karena bayi newborn belum banyak bergerak dan sering pup berair. Popok perekat memudahkan Bunda membersihkan tanpa harus menarik popok ke bawah menyusuri kaki.</p><h2>Kapan Beralih ke Pants?</h2><p>Saat si kecil mulai aktif berguling (sekitar usia 4-5 bulan), popok perekat akan lebih rentan lepas. Inilah saat yang tepat beralih ke Popok Celana (Pants) yang elastis dan anti bocor meski si kecil banyak gerak.</p>`,
    coverImage: "https://images.unsplash.com/photo-1519689680058-324335c77eba?w=1200&h=630&fit=crop",
    author: mockAuthors[0],
    categoryId: "cat-1",
    categoryName: "Popok Celana (Pants)",
    tags: ["popok celana", "popok perekat", "parenting"],
    readingTime: 6,
    status: "published",
    publishedAt: "2024-05-10T10:00:00Z",
    createdAt: "2024-05-08T00:00:00Z",
    updatedAt: "2024-05-10T10:00:00Z",
  },
  {
    id: "blog-4",
    title: "Review: Mengapa Breastpump Hospital Grade Jadi Favorit Busui?",
    slug: "review-breastpump-hospital-grade",
    excerpt: "Memompa ASI dengan alat yang tepat sangat mempengaruhi hasil perahan. Kenali keunggulan pompa ASI Hospital Grade untuk stok ASI melimpah.",
    content: `<h2>Apa Itu Hospital Grade?</h2><p>Pompa ASI Hospital Grade dirancang dengan mesin yang lebih kokoh (heavy duty) dan daya hisap yang stabil. Mereka dilengkapi dengan sistem closed-system yang mencegah ASI masuk ke dalam mesin, sehingga lebih higienis.</p>`,
    coverImage: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=1200&h=630&fit=crop",
    author: mockAuthors[2],
    categoryId: "cat-5",
    categoryName: "Perlengkapan Menyusui",
    tags: ["ASI", "menyusui", "breastpump", "busui"],
    readingTime: 8,
    status: "published",
    publishedAt: "2024-04-25T08:00:00Z",
    createdAt: "2024-04-22T00:00:00Z",
    updatedAt: "2024-04-25T08:00:00Z",
  },
];

// ================================
// Testimonials
// ================================
export const mockTestimonials: Testimonial[] = [
  {
    id: "testi-1",
    customerName: "Bunda Ayu Kinanti",
    customerPhoto: "https://i.pravatar.cc/150?img=32",
    customerTitle: "Ibu Rumah Tangga, Jakarta",
    rating: 5,
    content: "Toko Manur bener-bener nolong banget kalau stok pampers anak mendadak habis! Pengirimannya super cepat pake instan, harganya juga sering promo jauh lebih murah dari supermarket. Langganan terus pokoknya!",
    isActive: true,
    createdAt: "2024-05-15T00:00:00Z",
  },
  {
    id: "testi-2",
    customerName: "Mama Kikan",
    customerPhoto: "https://i.pravatar.cc/150?img=16",
    customerTitle: "Working Mom, Surabaya",
    rating: 5,
    content: "Anakku kulitnya super sensitif, gampang ruam. Konsultasi sama CS Toko Manur via WA, direkomendasiin Merries Pants & Sebamed. Sejak saat itu kulit anak bersih bebas ruam. Pelayanan bintang 5!",
    isActive: true,
    createdAt: "2024-05-20T00:00:00Z",
  },
  {
    id: "testi-3",
    customerName: "Bapak Rizky Pratama",
    customerPhoto: "https://i.pravatar.cc/150?img=11",
    customerTitle: "Ayah Baru, Bandung",
    rating: 5,
    content: "Sebagai ayah baru, saya sering bingung beli popok yang mana. Beli di Toko Manur enak banget karena aplikasinya jelas, milih ukuran berdasar BB anak, dan barangnya dijamin ori.",
    isActive: true,
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "testi-4",
    customerName: "Ibu Siti Aisyah",
    customerPhoto: "https://i.pravatar.cc/150?img=9",
    customerTitle: "Ibu dari Anak Kembar, Yogyakarta",
    rating: 4,
    content: "Beli popok untuk anak kembar itu butuh budget ekstra. Untung ada paketan promo di Toko Manur, lumayan hemat budget bulanan! Pengemasan rapi dan nggak pernah penyok boxnya.",
    isActive: true,
    createdAt: "2024-06-10T00:00:00Z",
  },
];

// ================================
// Hero Banners
// ================================
export const mockHeroBanners: HeroBanner[] = [
  {
    id: "hero-1",
    title: "Kebutuhan Bunda & Si Kecil, Cukup Satu Klik!",
    subtitle: "Distributor popok dan perlengkapan bayi terlengkap",
    description: "Temukan berbagai macam popok bayi dari brand ternama, tisu basah, susu, hingga perlengkapan menyusui dengan harga spesial dan jaminan 100% original.",
    image: "/red-hero.png",
    ctaText: "Belanja Popok",
    ctaUrl: "/products",
    ctaSecondaryText: "Konsultasi Bunda",
    ctaSecondaryUrl: "https://wa.me/6281234567890",
    isActive: true,
    order: 1,
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "hero-2",
    title: "Promo Gila Popok Anti Bocor!",
    subtitle: "Diskon up to 40% untuk Brand Favorit",
    description: "Pastikan tidur si kecil nyenyak semalaman tanpa gangguan bocor. Beli sekarang mumpung stok masih melimpah!",
    image: "https://images.unsplash.com/photo-1522771930-78848d9293e8?w=1920&h=1080&fit=crop",
    ctaText: "Lihat Promo",
    ctaUrl: "/products?category=popok-celana",
    isActive: true,
    order: 2,
    createdAt: "2024-01-01T00:00:00Z",
  },
];

// ================================
// Promos
// ================================
export const mockPromos: Promo[] = [
  {
    id: "promo-1",
    title: "Gratis Ongkir Instan",
    subtitle: "Khusus wilayah Kota",
    description: "Kehabisan popok tiba-tiba? Tenang, belanja minimal Rp 200.000 dapat gratis ongkir pengiriman instan (sampai dalam 2 jam).",
    badgeText: "FREE INSTAN",
    ctaText: "Belanja Sekarang",
    ctaUrl: "/products",
    backgroundColor: "#EFF6FF", // Soft Blue
    isActive: true,
    order: 1,
    validUntil: "2024-12-31T23:59:59Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "promo-2",
    title: "Diskon 15% Brand Merries",
    subtitle: "Gunakan kode: MERRIES15",
    description: "Dapatkan ekstra potongan 15% untuk semua varian Merries Pants dan Tape ukuran berapapun.",
    badgeText: "DISKON 15%",
    ctaText: "Klaim Merries",
    ctaUrl: "/products",
    backgroundColor: "#FDF4FF", // Soft Fuchsia/Pink
    isActive: true,
    order: 2,
    validUntil: "2024-08-31T23:59:59Z",
    createdAt: "2024-06-01T00:00:00Z",
  },
  {
    id: "promo-3",
    title: "Paket Newborn Starter",
    subtitle: "Hemat hingga 30%",
    description: "Isi lengkap: Popok Newborn, Tisu Basah, Sabun Mandi, dan Minyak Telon.",
    badgeText: "PAKET HEMAT",
    ctaText: "Beli Paket",
    ctaUrl: "/products",
    backgroundColor: "#FFFBEB", // Soft Yellow
    isActive: true,
    order: 3,
    createdAt: "2024-05-01T00:00:00Z",
  },
];

// ================================
// Marketplace Links
// ================================
export const mockMarketplaceLinks: MarketplaceLink[] = [
  {
    id: "mp-1",
    platform: "shopee",
    name: "Shopee Mall",
    url: "https://shopee.co.id/tokomanurbaby",
    description: "Bebas ongkir & voucher cashback koin",
    isActive: true,
    order: 1,
  },
  {
    id: "mp-2",
    platform: "tokopedia",
    name: "Tokopedia Official Store",
    url: "https://tokopedia.com/tokomanurbaby",
    description: "Layanan GoSend instan cepat aman",
    isActive: true,
    order: 2,
  },
  {
    id: "mp-3",
    platform: "tiktok",
    name: "TikTok Shop",
    url: "https://tiktok.com/@tokomanurbaby",
    description: "Live sale flash sale popok tiap jam 8 malam!",
    isActive: true,
    order: 3,
  },
  {
    id: "mp-4",
    platform: "custom",
    name: "Akulaku Mall",
    url: "https://akulaku.com/tokomanurbaby",
    description: "Cicilan 0% untuk pembelian popok dan perlengkapan bayi",
    isActive: true,
    order: 4,
  },
];

// ================================
// Company Profile
// ================================
export const mockCompanyProfile: CompanyProfile = {
  id: "company-1",
  about:
    "Toko Manur Baby Care hadir sejak 2018 sebagai sahabat terpercaya para Ibu di Indonesia. Kami menyediakan berbagai kebutuhan popok bayi, perawatan kulit si kecil, dan perlengkapan menyusui dari brand-brand terkemuka dengan jaminan orisinalitas 100%.",
  vision:
    "Menjadi destinasi belanja kebutuhan ibu dan bayi nomor satu yang memberikan kemudahan, kenyamanan, dan edukasi parenting yang bermanfaat.",
  mission: [
    "Menyediakan ragam pilihan popok dan kebutuhan bayi terlengkap dengan harga kompetitif",
    "Menjamin keaslian setiap produk untuk keamanan dan kesehatan si kecil",
    "Memberikan pelayanan pengiriman cepat (instan delivery) untuk solusi darurat Bunda",
    "Menyajikan konten edukasi parenting yang terpercaya dari para ahli",
  ],
  values: [
    {
      id: "val-1",
      title: "100% Original (Aman)",
      description: "Kami hanya menjual produk resmi dari distributor principal, menjamin keaslian dan masa expired yang panjang.",
      icon: "shield",
    },
    {
      id: "val-2",
      title: "Penuh Kasih Ibu",
      description: "Layanan kami mengedepankan empati dan kelembutan, siap membantu Bunda memilihkan produk terbaik.",
      icon: "heart",
    },
    {
      id: "val-3",
      title: "Pengiriman Cepat",
      description: "Popok habis di malam hari? Layanan pengiriman cepat kami menjadi andalan di saat darurat.",
      icon: "zap",
    },
    {
      id: "val-4",
      title: "Kualitas Premium",
      description: "Semua barang disimpan dalam suhu ruangan terkontrol untuk menjaga higienitas dan kualitas popok.",
      icon: "star",
    },
  ],
  brandStory:
    "Berawal dari kesulitan seorang ibu pekerja mencari stok popok langganan saat malam hari, Toko Manur lahir sebagai solusi kepraktisan. Kami memahami bahwa kehabisan popok atau anak tiba-tiba ruam adalah momen menegangkan bagi orang tua baru. Oleh karena itu, Toko Manur tidak hanya sekedar berjualan, tapi menjadi 'support system' para Bunda.",
  founded: "2018",
  legalDocuments: [
    { id: "leg-1", name: "NIB", number: "9120301456789", issuedBy: "OSS RI", issuedDate: "2018-03-15" },
    { id: "leg-2", name: "SIUP", number: "503/1234/SIUP-B/2018", issuedBy: "Dinas Perdagangan", issuedDate: "2018-04-01" },
    { id: "leg-3", name: "NPWP", number: "12.345.678.9-123.000", issuedBy: "DJP Kementerian Keuangan RI", issuedDate: "2018-04-15" },
  ],
  updatedAt: "2024-06-01T00:00:00Z",
};

// ================================
// Contact Info
// ================================
export const mockContactInfo: ContactInfo = {
  id: "contact-1",
  address: "Jl. Kasih Bunda No. 88, Kecamatan Kebayoran Baru, Jakarta Selatan 12160",
  email: "halo@tokomanurbaby.id",
  whatsapp: "6281234567890",
  whatsappMessage: "Halo Toko Manur Baby Care, saya mau tanya stok popok ukuran...",
  googleMapsEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.27!2d106.79!3d-6.24!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTQnMjQuMCJTIDEwNsKwNDcnMjQuMCJF!5e0!3m2!1sen!2sid!4v1",
  latitude: "-6.240000",
  longitude: "106.790000",
  businessHours: "Setiap Hari (Termasuk Tanggal Merah): 07.00 – 22.00 WIB",
  instagram: "https://instagram.com/tokomanurbaby",
  facebook: "https://facebook.com/tokomanurbaby",
  tiktok: "https://tiktok.com/@tokomanurbaby",
  updatedAt: "2024-06-01T00:00:00Z",
};

// ================================
// Users
// ================================
export const mockUsers: User[] = [
  {
    id: "user-1",
    name: "Admin Utama",
    email: "admin@tokomanurbaby.id",
    role: "superadmin",
    avatar: "https://i.pravatar.cc/150?img=33",
    isActive: true,
    lastLogin: "2024-06-20T09:00:00Z",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: "user-2",
    name: "Kania Putri",
    email: "kania@tokomanurbaby.id",
    role: "admin",
    avatar: "https://i.pravatar.cc/150?img=5",
    isActive: true,
    lastLogin: "2024-06-19T14:30:00Z",
    createdAt: "2024-02-01T00:00:00Z",
  },
];

// ================================
// Settings
// ================================
export const mockSettings: SiteSettings = {
  id: "settings-1",
  siteName: "Toko Manur Baby Care",
  siteTagline: "Sahabat Belanja Bunda & Si Kecil",
  socialMedia: [
    { platform: "Instagram", url: "https://instagram.com/tokomanurbaby" },
    { platform: "Facebook", url: "https://facebook.com/tokomanurbaby" },
    { platform: "TikTok", url: "https://tiktok.com/@tokomanurbaby" },
  ],
  footerText: "© 2024 Toko Manur Baby Care. Pusat perlengkapan ibu dan bayi terpercaya.",
  seoTitle: "Toko Manur — Distributor Popok & Perlengkapan Bayi Termurah",
  seoDescription: "Pusat belanja kebutuhan ibu dan anak. Menyediakan popok MamyPoko, Merries, Pampers, Sweety termurah dan perlengkapan mandi bayi 100% original.",
  seoKeywords: "popok bayi, pampers murah, merries pants, mamypoko pants, perlengkapan bayi, toko bayi terdekat, tisu basah",
  updatedAt: "2024-06-01T00:00:00Z",
};

// ================================
// Dashboard Stats (mock)
// ================================
export const mockDashboardStats = {
  totalProducts: mockProducts.length,
  totalBlogs: mockBlogs.length,
  totalTestimonials: mockTestimonials.length,
  totalCategories: mockCategories.length,
  monthlyVisitors: 45892,
  monthlyOrders: 2154,
  recentProducts: mockProducts.slice(0, 5),
  recentBlogs: mockBlogs.slice(0, 5),
};
