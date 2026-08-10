import { NextResponse } from 'next/server';
import { ReviewSyncService } from '@/lib/review-sync';
import { Marketplace } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { marketplace, productUrl } = await request.json();

    if (!marketplace || !productUrl) {
      return NextResponse.json(
        { error: 'Marketplace and productUrl are required' },
        { status: 400 }
      );
    }

    if (!Object.values(Marketplace).includes(marketplace as Marketplace)) {
      return NextResponse.json(
        { error: 'Invalid marketplace' },
        { status: 400 }
      );
    }

    const syncService = new ReviewSyncService();
    
    // We run the sync. Note: in a real production environment with Playwright,
    // this might timeout if it takes longer than the serverless function limit.
    // Ideally this should be a background job.
    const result = await syncService.syncReviews(marketplace as Marketplace, productUrl);
    
    await syncService.disconnect();

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('API Error syncing reviews:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to sync reviews' },
      { status: 500 }
    );
  }
}
