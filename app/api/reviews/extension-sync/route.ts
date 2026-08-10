import { NextResponse } from 'next/server';
import { ReviewSyncService } from '@/lib/review-sync';
import { Marketplace } from '@/lib/db';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { marketplace, productUrl, reviews } = body;

    if (!marketplace || !reviews || !Array.isArray(reviews)) {
      return NextResponse.json(
        { error: 'Marketplace and valid reviews array are required' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    if (!Object.values(Marketplace).includes(marketplace as Marketplace)) {
      return NextResponse.json(
        { error: 'Invalid marketplace' },
        { 
          status: 400,
          headers: { 'Access-Control-Allow-Origin': '*' }
        }
      );
    }

    const syncService = new ReviewSyncService();
    
    // Save raw reviews directly without playwright
    const result = await syncService.saveRawReviews(marketplace as Marketplace, reviews);
    
    await syncService.disconnect();

    return NextResponse.json(result, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error: any) {
    console.error('API Error saving raw reviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to save reviews' },
      { 
        status: 500,
        headers: { 'Access-Control-Allow-Origin': '*' }
      }
    );
  }
}
