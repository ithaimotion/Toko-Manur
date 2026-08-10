import { NextResponse } from 'next/server';
import { PrismaClient } from '@toko-manur/db';

const prisma = new PrismaClient();

// GET /api/blog-categories/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const category = await prisma.blogCategory.findUnique({ where: { id } });

    if (!category) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(category);
  } catch (error: any) {
    console.error('API Error fetching blog category:', error);
    return NextResponse.json({ error: 'Gagal mengambil data kategori' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}

// PUT /api/blog-categories/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.name?.trim() || !data.slug?.trim()) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    const existing = await prisma.blogCategory.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    const updated = await prisma.blogCategory.update({
      where: { id },
      data: {
        name: data.name.trim(),
        slug: data.slug.trim(),
        description: data.description?.trim() ?? null,
      },
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API Error updating blog category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug sudah digunakan kategori lain' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Gagal mengupdate kategori', details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE /api/blog-categories/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const existing = await prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { blogs: true } } },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Kategori tidak ditemukan' }, { status: 404 });
    }

    // Cek apakah kategori masih digunakan oleh blog
    if (existing._count.blogs > 0) {
      return NextResponse.json(
        {
          error: `Kategori tidak bisa dihapus karena masih digunakan oleh ${existing._count.blogs} artikel. Ubah kategori artikel terlebih dahulu.`,
        },
        { status: 400 }
      );
    }

    await prisma.blogCategory.delete({ where: { id } });

    return NextResponse.json({ message: 'Kategori berhasil dihapus' });
  } catch (error: any) {
    console.error('API Error deleting blog category:', error);
    return NextResponse.json({ error: 'Gagal menghapus kategori' }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
