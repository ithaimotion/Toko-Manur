import { db } from '@/lib/db';
import type { Blog } from '@/lib/types';

/**
 * Konversi data Prisma Blog ke tipe Blog dari @/lib/types
 */
function mapBlog(raw: any): Blog {
  return {
    id: raw.id,
    title: raw.title,
    slug: raw.slug,
    excerpt: raw.excerpt ?? '',
    content: raw.content,
    coverImage: raw.coverImage ?? undefined,
    author: {
      id: raw.author?.id ?? '',
      name: raw.author?.name ?? 'Admin',
      role: raw.author?.role ?? 'EDITOR',
      avatar: undefined,
    },
    categoryId: raw.categoryId ?? undefined,
    categoryName: raw.category?.name ?? undefined,
    tags: Array.isArray(raw.tags) ? raw.tags : [],
    seoTitle: raw.seoTitle ?? undefined,
    seoDescription: raw.seoDescription ?? undefined,
    readingTime: raw.readingTime ?? 1,
    status: raw.status === 'PUBLISHED' ? 'published' : 'draft',
    publishedAt: raw.publishedAt?.toISOString() ?? raw.createdAt.toISOString(),
    createdAt: raw.createdAt.toISOString(),
    updatedAt: raw.updatedAt.toISOString(),
  };
}

export async function getPublishedBlogs({
  search = '',
  categoryName = '',
  limit,
}: {
  search?: string;
  categoryName?: string;
  limit?: number;
} = {}): Promise<Blog[]> {
  try {
    const where: any = { status: 'PUBLISHED' };

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { excerpt: { contains: search } },
      ];
    }

    if (categoryName) {
      where.category = { name: categoryName };
    }

    const blogs = await db.blog.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, role: true } },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      ...(limit ? { take: limit } : {}),
    });

    return blogs.map(mapBlog);
  } catch (error) {
    console.error('Error fetching published blogs:', error);
    return [];
  } finally {
    
  }
}

export async function getBlogBySlug(slug: string): Promise<Blog | null> {
  try {
    const blog = await db.blog.findUnique({
      where: { slug, status: 'PUBLISHED' },
      include: {
        author: { select: { id: true, name: true, role: true } },
        category: true,
      },
    });

    if (!blog) return null;
    return mapBlog(blog);
  } catch (error) {
    console.error('Error fetching blog by slug:', error);
    return null;
  } finally {
    
  }
}

export async function getAllPublishedBlogSlugs(): Promise<string[]> {
  try {
    const blogs = await db.blog.findMany({
      where: { status: 'PUBLISHED' },
      select: { slug: true },
    });
    return blogs.map((b) => b.slug);
  } catch {
    return [];
  } finally {
    
  }
}

export async function getBlogCategories(): Promise<string[]> {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
      select: { name: true },
    });
    return categories.map((c) => c.name);
  } catch {
    return [];
  } finally {
    
  }
}

export async function getRelatedBlogs(currentId: string, categoryId?: string | null, limit = 3): Promise<Blog[]> {
  try {
    const where: any = {
      id: { not: currentId },
      status: 'PUBLISHED',
    };

    if (categoryId) {
      where.categoryId = categoryId;
    }

    const blogs = await db.blog.findMany({
      where,
      include: {
        author: { select: { id: true, name: true, role: true } },
        category: true,
      },
      orderBy: { publishedAt: 'desc' },
      take: limit,
    });

    return blogs.map(mapBlog);
  } catch {
    return [];
  } finally {
    
  }
}
