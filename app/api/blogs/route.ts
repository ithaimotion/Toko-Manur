import { NextResponse } from 'next/server';
import { db } from "@/lib/db";



export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status') || 'all';

    const where: any = {};
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { content: { contains: search } },
      ];
    }
    if (status && status !== 'all') {
      where.status = status.toUpperCase();
    }

    const blogs = await db.blog.findMany({
      where,
      include: {
        author: {
          select: { id: true, name: true, role: true }
        },
        category: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(blogs);
  } catch (error: any) {
    console.error('API Error fetching blogs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  } finally {
    
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Validate required fields
    if (!data.title || !data.slug || !data.content) {
      return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
    }

    // Default author to an existing user for simplicity since we don't have proper auth session context here yet
    // In a real app this would come from session
    const defaultUser = await db.user.findFirst();
    
    if (!defaultUser) {
      return NextResponse.json({ error: 'No user found in database to set as author' }, { status: 400 });
    }

    const blogData: any = {
      title: data.title,
      slug: data.slug,
      excerpt: data.excerpt || '',
      content: data.content,
      seoTitle: data.seoTitle || data.title,
      seoDescription: data.seoDescription || data.excerpt,
      status: data.status?.toUpperCase() || 'DRAFT',
      authorId: defaultUser.id,
      readingTime: Math.max(1, Math.ceil(data.content.length / 1000)), // Rough estimate
    };

    if (data.categoryId) {
       blogData.categoryId = data.categoryId;
    }

    if (data.status === 'published') {
      blogData.publishedAt = new Date();
    }

    const newBlog = await db.blog.create({
      data: blogData,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error: any) {
    console.error('API Error creating blog:', error);
    
    if (error.code === 'P2002') {
      return NextResponse.json({ error: 'Slug already exists' }, { status: 400 });
    }
    
    return NextResponse.json(
      { error: 'Failed to create blog', details: error.message },
      { status: 500 }
    );
  } finally {
    
  }
}
