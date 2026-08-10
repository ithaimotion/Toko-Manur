import { NextResponse } from 'next/server';
import { PrismaClient } from '@toko-manur/db';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace');
    const featuredOnly = searchParams.get('featured') === 'true';
    const limit = parseInt(searchParams.get('limit') || '50');

    const where: any = {};
    if (marketplace && marketplace !== 'ALL') {
      where.marketplace = marketplace;
    }
    if (featuredOnly) {
      where.featured = true;
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { reviewDate: 'desc' },
      take: limit,
    });

    return NextResponse.json(reviews);
  } catch (error: any) {
    console.error('API Error fetching reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
