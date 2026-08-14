import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const product = await db.product.findUnique({
      where: { id },
      include: {
        brand: {
          select: { id: true, name: true, slug: true }
        }
      }
    });

    if (!product) {
      return NextResponse.json({ error: "Produk tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ error: "Gagal mengambil data produk" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, shortDescription, images, price, priceLabel, isFeatured, status, brandId, specifications, marketplaceLinks } = body;

    if (!name || !slug || !brandId || !images) {
      return NextResponse.json({ error: "Kolom wajib belum diisi" }, { status: 400 });
    }

    const exists = await db.product.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (exists) {
      return NextResponse.json({ error: "Slug sudah digunakan oleh produk lain" }, { status: 400 });
    }

    const product = await db.product.update({
      where: { id },
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

    return NextResponse.json(product);
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json({ error: "Gagal memperbarui produk" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ error: "Gagal menghapus produk" }, { status: 500 });
  }
}
