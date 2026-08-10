import { NextResponse } from 'next/server';
import { PrismaClient } from '@toko-manur/db';

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const marketplace = searchParams.get('marketplace');
    const search = searchParams.get('search');
    
    const where: any = {};
    if (marketplace && marketplace !== 'ALL') {
      where.marketplace = marketplace;
    }
    
    if (search) {
      where.OR = [
        { productName: { contains: search } },
        { username: { contains: search } },
        { comment: { contains: search } },
      ];
    }

    const reviews = await prisma.review.findMany({
      where,
      orderBy: { reviewDate: 'desc' },
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

export async function PATCH(request: Request) {
  try {
    const { id, featured } = await request.json();
    if (!id) {
       return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    const updatedReview = await prisma.review.update({
      where: { id },
      data: { featured },
    });

    return NextResponse.json(updatedReview);
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
       return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    await prisma.review.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: 'Failed to delete review' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
