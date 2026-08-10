import { NextResponse } from 'next/server';
import { db } from "@/lib/db";



// GET /api/blog-categories
export async function GET() {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
    });
    return NextResponse.json(categories);
  } catch (error: any) {
    console.error('API Error fetching blog categories:', error);
    return NextResponse.json({ error: 'Gagal mengambil kategori' }, { status: 500 });
  } finally {
    
  }
}

// POST /api/blog-categories
export async function POST(request: Request) {
  try {
    const data = await request.json();

    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'Nama dan slug wajib diisi' }, { status: 400 });
    }

    const category = await db.blogCategory.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description ?? '',
      },
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error: any) {
    console.error('API Error creating blog category:', error);
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug sudah digunakan' }, { status: 400 });
    }
    return NextResponse.json({ error: 'Gagal membuat kategori' }, { status: 500 });
  } finally {
    
  }
}
