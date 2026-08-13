import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true }
        }
      }
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json({ error: "Gagal mengambil data brand" }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { name, slug, description, image } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: "Nama dan slug wajib diisi" }, { status: 400 });
    }

    const exists = await db.brand.findFirst({
      where: {
        slug,
        NOT: { id }
      }
    });

    if (exists) {
      return NextResponse.json({ error: "Slug sudah digunakan oleh brand lain" }, { status: 400 });
    }

    const brand = await db.brand.update({
      where: { id },
      data: { name, slug, description, image },
    });

    return NextResponse.json(brand);
  } catch (error) {
    console.error("Error updating brand:", error);
    return NextResponse.json({ error: "Gagal memperbarui brand" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    // Check if brand has products
    const brand = await db.brand.findUnique({
      where: { id },
      include: {
        _count: { select: { products: true } }
      }
    });

    if (!brand) {
      return NextResponse.json({ error: "Brand tidak ditemukan" }, { status: 404 });
    }

    if (brand._count.products > 0) {
      return NextResponse.json({ error: "Tidak dapat menghapus brand karena masih memiliki produk yang terhubung" }, { status: 400 });
    }

    await db.brand.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting brand:", error);
    return NextResponse.json({ error: "Gagal menghapus brand" }, { status: 500 });
  }
}
