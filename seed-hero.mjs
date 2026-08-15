import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Check if any hero banner exists
  const existing = await prisma.heroBanner.findFirst();
  if (existing) {
    console.log("Hero banner already exists");
    return;
  }

  const banner = await prisma.heroBanner.create({
    data: {
      title: "Kebutuhan Bunda & Si Kecil, Cukup Satu Klik!",
      subtitle: "Distributor popok dan perlengkapan bayi terlengkap",
      description: "Temukan berbagai macam popok bayi dari brand ternama, tisu basah, susu, hingga perlengkapan menyusui dengan harga spesial dan jaminan 100% original.",
      image: "/red-hero.png",
      ctaText: "Belanja Popok",
      ctaUrl: "/products",
      ctaSecondaryText: "Konsultasi Bunda",
      ctaSecondaryUrl: "https://api.whatsapp.com/send/?phone=628217232299&text=Halo%2Csaya+ingin+tanya+produk+Toko+Manur.Boleh+dibantu%3F&type=phone_number&app_absent=0",
      isActive: true,
      order: 1,
      carouselItems: {
        create: [
          {
            marketplace: "Shopee",
            image: "https://placehold.co/800x600/EE4D2D/white?text=Shopee",
            trustCount: "15,000+",
            rating: "4.9/5",
            order: 1
          },
          {
            marketplace: "Tokopedia",
            image: "https://placehold.co/800x600/42B549/white?text=Tokopedia",
            trustCount: "12,500+",
            rating: "4.8/5",
            order: 2
          },
          {
            marketplace: "Lazada",
            image: "https://placehold.co/800x600/0F146D/white?text=Lazada",
            trustCount: "8,000+",
            rating: "4.7/5",
            order: 3
          },
          {
            marketplace: "TikTok Shop",
            image: "https://placehold.co/800x600/000000/white?text=TikTok+Shop",
            trustCount: "20,000+",
            rating: "4.9/5",
            order: 4
          }
        ]
      }
    }
  });

  console.log("Seeded hero banner:", banner.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
