import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateImages() {
  const images = {
    "panduan-memilih-popok-bayi-yang-nyaman": "https://images.pexels.com/photos/1648377/pexels-photo-1648377.jpeg?auto=compress&cs=tinysrgb&w=800",
    "tips-mengganti-popok-bayi-dengan-nyaman-dan-praktis": "https://images.pexels.com/photos/39589/toddler-baby-child-cute-39589.jpeg?auto=compress&cs=tinysrgb&w=800",
    "cara-menentukan-ukuran-popok-bayi-yang-tepat": "https://images.unsplash.com/photo-1519689680058-324335c77eba?q=80&w=800&auto=format&fit=crop"
  };

  for (const [slug, imageUrl] of Object.entries(images)) {
    await prisma.blog.updateMany({
      where: { slug },
      data: { coverImage: imageUrl }
    });
  }
  
  console.log("Cover images updated successfully!");
}

updateImages()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
