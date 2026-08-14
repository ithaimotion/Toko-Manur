import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const brandId = searchParams.get('brandId');
  const status = searchParams.get('status');

  try {
    const where: any = {};
    if (brandId) where.brandId = brandId;
    if (status) where.status = status;

    const products = await db.product.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        brand: {
          select: { id: true, name: true, slug: true }
        }
      }
    });
    return NextResponse.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, slug, description, shortDescription, images, price, priceLabel, isFeatured, status, brandId, specifications, marketplaceLinks } = body;

    if (!name || !slug || !brandId || !images) {
      return NextResponse.json({ error: "Kolom wajib belum diisi (Nama, Slug, Brand, Gambar)" }, { status: 400 });
    }

    const exists = await db.product.findUnique({ where: { slug } });
    if (exists) {
      return NextResponse.json({ error: "Slug sudah digunakan" }, { status: 400 });
    }

    const product = await db.product.create({
      data: { 
        name, 
        slug, 
        description: description || "", 
        shortDescription, 
        images, 
        price: price ? parseFloat(price) : null, 
        priceLabel, 
        isFeatured: isFeatured || false, 
        status: status || "PUBLISHED", 
        brandId, 
        specifications: specifications || [],
        marketplaceLinks: marketplaceLinks || []
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Gagal membuat produk" }, { status: 500 });
  }
}
