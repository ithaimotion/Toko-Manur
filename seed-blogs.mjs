import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Get first user as author
  const user = await prisma.user.findFirst();
  if (!user) {
    console.error("No user found. Please run seed first or create a user.");
    process.exit(1);
  }

  // Create or get category
  const category = await prisma.blogCategory.upsert({
    where: { slug: 'parenting' },
    update: {},
    create: {
      name: 'Parenting',
      slug: 'parenting',
      description: 'Artikel seputar perawatan dan pengasuhan anak',
    }
  });

  const blogs = [
    {
      title: "Panduan Memilih Popok Bayi yang Nyaman untuk Si Kecil",
      slug: "panduan-memilih-popok-bayi-yang-nyaman",
      excerpt: "Memilih popok bayi tidak hanya soal daya serap. Kenyamanan, ukuran, bahan, dan kecocokan dengan kulit bayi juga perlu diperhatikan.",
      content: "<p>Memilih <strong>popok bayi</strong> yang tepat merupakan salah satu hal penting bagi orang tua. Popok digunakan dalam waktu yang cukup lama setiap hari, sehingga kenyamanan dan kemampuan menyerap cairan menjadi pertimbangan utama.</p><h2>Perhatikan Ukuran Popok</h2><p>Pastikan ukuran popok sesuai dengan kondisi dan kebutuhan bayi. Popok yang terlalu kecil dapat terasa sempit, sedangkan ukuran yang terlalu besar berpotensi menyebabkan kebocoran.</p><h2>Pilih Bahan yang Nyaman</h2><p>Bahan popok yang lembut dan memiliki sirkulasi udara yang baik dapat membantu menjaga kenyamanan kulit bayi. Orang tua juga dapat memperhatikan apakah bayi memiliki reaksi tertentu terhadap bahan atau produk yang digunakan.</p><h2>Perhatikan Daya Serap</h2><p>Daya serap merupakan salah satu faktor penting dalam memilih popok. Popok dengan daya serap yang baik dapat membantu menjaga permukaan kulit tetap lebih kering dan mengurangi risiko kebocoran.</p><p>Dengan memperhatikan ukuran, bahan, kenyamanan, dan daya serap, orang tua dapat memilih popok yang lebih sesuai dengan kebutuhan si kecil.</p>",
      seoTitle: "Panduan Memilih Popok Bayi yang Nyaman",
      seoDescription: "Simak panduan memilih popok bayi berdasarkan ukuran, bahan, kenyamanan, dan daya serap untuk kebutuhan si kecil.",
      status: "PUBLISHED",
      authorId: user.id,
      categoryId: category.id,
      readingTime: 3,
      publishedAt: new Date(),
    },
    {
      title: "Tips Mengganti Popok Bayi dengan Nyaman dan Praktis",
      slug: "tips-mengganti-popok-bayi-dengan-nyaman-dan-praktis",
      excerpt: "Mengganti popok merupakan rutinitas sehari-hari bagi orang tua. Dengan persiapan yang tepat, proses mengganti popok dapat dilakukan dengan lebih nyaman dan praktis.",
      content: "<p><strong>Mengganti popok bayi</strong> merupakan rutinitas yang dilakukan berkali-kali dalam sehari. Agar prosesnya lebih nyaman, orang tua sebaiknya menyiapkan semua perlengkapan sebelum mulai mengganti popok.</p><h2>Siapkan Perlengkapan</h2><p>Pastikan popok baru dan perlengkapan kebersihan sudah tersedia di dekat tempat mengganti popok. Persiapan ini membuat proses penggantian menjadi lebih praktis.</p><h2>Perhatikan Kebersihan</h2><p>Kebersihan menjadi hal penting saat mengganti popok. Bersihkan area popok dengan lembut dan pastikan kulit bayi tetap nyaman sebelum menggunakan popok baru.</p><h2>Pastikan Popok Terpasang dengan Baik</h2><p>Popok sebaiknya dipasang dengan posisi yang nyaman dan tidak terlalu ketat. Periksa kembali bagian pinggang dan sisi popok agar tidak mengganggu gerakan bayi.</p><p>Dengan perlengkapan yang lengkap dan proses yang dilakukan secara rutin, aktivitas mengganti popok dapat menjadi lebih mudah bagi orang tua maupun bayi.</p>",
      seoTitle: "Tips Mengganti Popok Bayi dengan Nyaman",
      seoDescription: "Pelajari tips mengganti popok bayi dengan lebih nyaman dan praktis, mulai dari menyiapkan perlengkapan hingga memasang popok.",
      status: "PUBLISHED",
      authorId: user.id,
      categoryId: category.id,
      readingTime: 2,
      publishedAt: new Date(),
    },
    {
      title: "Cara Menentukan Ukuran Popok Bayi yang Tepat",
      slug: "cara-menentukan-ukuran-popok-bayi-yang-tepat",
      excerpt: "Ukuran popok yang tepat dapat membantu bayi bergerak dengan nyaman sekaligus mengurangi kemungkinan terjadinya kebocoran.",
      content: "<p><strong>Ukuran popok bayi</strong> menjadi salah satu faktor penting yang perlu diperhatikan saat memilih popok. Setiap bayi memiliki perkembangan dan bentuk tubuh yang berbeda, sehingga ukuran popok perlu disesuaikan secara berkala.</p><h2>Perhatikan Panduan Ukuran</h2><p>Produsen popok biasanya menyediakan panduan ukuran berdasarkan berat badan bayi. Gunakan panduan tersebut sebagai salah satu acuan ketika memilih ukuran popok.</p><h2>Perhatikan Kenyamanan Bayi</h2><p>Selain melihat ukuran yang tertera pada kemasan, perhatikan bagaimana popok terasa saat digunakan. Popok yang terlalu ketat dapat membuat bayi tidak nyaman, sementara popok yang terlalu longgar dapat meningkatkan kemungkinan kebocoran.</p><h2>Kapan Harus Naik Ukuran?</h2><p>Jika popok mulai terasa terlalu sempit atau sering mengalami kebocoran meskipun sudah dipasang dengan benar, orang tua dapat mempertimbangkan untuk mencoba ukuran berikutnya.</p><p>Memilih ukuran yang sesuai membantu memberikan kenyamanan bagi bayi sekaligus membuat penggunaan popok menjadi lebih efektif dalam aktivitas sehari-hari.</p>",
      seoTitle: "Cara Menentukan Ukuran Popok Bayi yang Tepat",
      seoDescription: "Ketahui cara menentukan ukuran popok bayi berdasarkan panduan ukuran, kenyamanan, dan kebutuhan si kecil.",
      status: "PUBLISHED",
      authorId: user.id,
      categoryId: category.id,
      readingTime: 3,
      publishedAt: new Date(),
    }
  ];

  let count = 0;
  for (const blog of blogs) {
    await prisma.blog.upsert({
      where: { slug: blog.slug },
      update: blog,
      create: blog,
    });
    count++;
  }
  
  console.log(`Successfully seeded ${count} blogs!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
