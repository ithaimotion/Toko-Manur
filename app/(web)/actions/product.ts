"use server";

import { db } from "@/lib/db";

export async function getFeaturedProducts({ limit = 4 }: { limit?: number } = {}) {
  try {
    const products = await db.product.findMany({
      where: {
        isFeatured: true,
        status: "PUBLISHED"
      },
      include: {
        brand: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching featured products:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

export async function getProducts(params?: { brand?: string }) {
  try {
    const whereClause: any = { status: "PUBLISHED" };
    
    if (params?.brand) {
      whereClause.brand = { slug: params.brand };
    }

    const products = await db.product.findMany({
      where: whereClause,
      include: {
        brand: {
          select: { name: true, slug: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    return { success: true, data: products };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

export async function getProductBySlug(slug: string) {
  try {
    const product = await db.product.findUnique({
      where: { slug },
      include: {
        brand: true
      }
    });
    
    if (!product || product.status !== "PUBLISHED") return { success: false, error: "Produk tidak ditemukan" };
    return { success: true, data: product };
  } catch (error) {
    console.error("Error fetching product by slug:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

export async function getBrands() {
  try {
    const brands = await db.brand.findMany({
      orderBy: { name: 'asc' }
    });
    
    return { success: true, data: brands };
  } catch (error) {
    console.error("Error fetching brands:", error);
    return { success: false, error: "Gagal mengambil data brand" };
  }
}
