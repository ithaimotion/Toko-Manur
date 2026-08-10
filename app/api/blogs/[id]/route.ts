import { NextResponse } from 'next/server';
import { db } from "@/lib/db";



// GET /api/blogs/[id]
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await db.blog.findUnique({
      where: { id },
      include: {
        author: { select: { id: true, name: true, role: true } },
        category: true,
      },
    });

    if (!blog) {
      return NextResponse.json({ error: 'Blog tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json(blog);
  } catch (error: any) {
    console.error('API Error fetching blog:', error);
    return NextResponse.json({ error: 'Gagal mengambil data blog' }, { status: 500 });
  } finally {
    
  }
}

// PUT /api/blogs/[id]
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const data = await request.json();

    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json(
        { error: 'Judul, slug, dan konten wajib diisi' },
        { status: 400 }
      );
    }

    // Cek apakah blog ada
    const existing = await db.blog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog tidak ditemukan' }, { status: 404 });
    }

    const updateData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt ?? '',
      content: data.content,
      seoTitle: data.seoTitle ?? data.title,
      seoDescription: data.seoDescription ?? data.excerpt ?? '',
      status: data.status?.toUpperCase() ?? existing.status,
      readingTime: Math.max(1, Math.ceil(data.content.length / 1000)),
    };

    // Atur categoryId (bisa null jika dikosongkan)
    if (data.categoryId) {
      updateData.categoryId = data.categoryId;
    } else {
      updateData.categoryId = null;
    }

    // Set publishedAt jika baru dipublikasikan
    if (data.status === 'published' && !existing.publishedAt) {
      updateData.publishedAt = new Date();
    }

    const updated = await db.blog.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error('API Error updating blog:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug sudah digunakan blog lain' }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Gagal mengupdate blog', details: error.message },
      { status: 500 }
    );
  } finally {
    
  }
}

// DELETE /api/blogs/[id]
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    // Cek apakah blog ada
    const existing = await db.blog.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: 'Blog tidak ditemukan' }, { status: 404 });
    }

    await db.blog.delete({ where: { id } });

    return NextResponse.json({ message: 'Blog berhasil dihapus' });
  } catch (error: any) {
    console.error('API Error deleting blog:', error);
    return NextResponse.json({ error: 'Gagal menghapus blog' }, { status: 500 });
  } finally {
    
  }
}
