import { Marketplace, PrismaClient } from '@toko-manur/db';
import { MarketplaceProvider } from '../providers/MarketplaceProvider';
import { ShopeeProvider } from '../providers/ShopeeProvider';
import { TokopediaProvider } from '../providers/TokopediaProvider';

export class ReviewSyncService {
  private providers: Map<Marketplace, MarketplaceProvider>;
  private db: PrismaClient;

  constructor() {
    this.db = new PrismaClient();
    this.providers = new Map();
    
    // Register providers
    this.registerProvider(new ShopeeProvider());
    this.registerProvider(new TokopediaProvider());
  }

  private registerProvider(provider: MarketplaceProvider) {
    this.providers.set(provider.marketplace, provider);
  }

  /**
   * Sync reviews for a given product URL from a specific marketplace.
   */
  async syncReviews(marketplace: Marketplace, productUrl: string, maxReviews: number = 20) {
    const provider = this.providers.get(marketplace);
    if (!provider) {
      throw new Error(`Provider for marketplace ${marketplace} not found.`);
    }

    try {
      const scrapedReviews = await provider.scrapeReviews(productUrl, maxReviews);
      
      let newReviewsCount = 0;

      for (const scraped of scrapedReviews) {
        // Basic Normalization (if needed in the future)
        const normalizedComment = scraped.comment?.trim() || null;
        
        // Upsert to handle duplication check automatically based on reviewId
        // Assuming reviewId is unique per marketplace in the source, we prefix it just in case
        const uniqueReviewId = `${marketplace}-${scraped.reviewId}`;

        await this.db.review.upsert({
          where: { reviewId: uniqueReviewId },
          update: {
            rating: scraped.rating,
            comment: normalizedComment,
            images: scraped.images,
            videos: scraped.videos,
            updatedAt: new Date(),
          },
          create: {
            marketplace,
            reviewId: uniqueReviewId,
            productName: scraped.productName,
            username: scraped.username,
            rating: scraped.rating,
            comment: normalizedComment,
            reviewDate: scraped.reviewDate,
            images: scraped.images,
            videos: scraped.videos,
          },
        });
        
        newReviewsCount++;
      }

      return {
        success: true,
        marketplace,
        syncedCount: newReviewsCount,
      };

    } catch (error) {
      console.error(`[ReviewSyncService] Failed to sync reviews for ${marketplace}`, error);
      throw error;
    }
  }

  /**
   * Save raw reviews scraped by external tools (e.g. Chrome Extension)
   */
  async saveRawReviews(marketplace: Marketplace, reviews: any[]) {
    try {
      let newReviewsCount = 0;
      
      for (const scraped of reviews) {
        const normalizedComment = scraped.comment?.trim() || null;
        const uniqueReviewId = scraped.reviewId.startsWith(marketplace) 
          ? scraped.reviewId 
          : `${marketplace}-${scraped.reviewId}`;

        await this.db.review.upsert({
          where: { reviewId: uniqueReviewId },
          update: {
            rating: scraped.rating,
            comment: normalizedComment,
            images: scraped.images || [],
            videos: scraped.videos || [],
            updatedAt: new Date(),
          },
          create: {
            marketplace,
            reviewId: uniqueReviewId,
            productName: scraped.productName,
            username: scraped.username,
            rating: scraped.rating,
            comment: normalizedComment,
            reviewDate: scraped.reviewDate ? new Date(scraped.reviewDate) : new Date(),
            images: scraped.images || [],
            videos: scraped.videos || [],
          },
        });
        
        newReviewsCount++;
      }

      return {
        success: true,
        marketplace,
        syncedCount: newReviewsCount,
      };
    } catch (error) {
      console.error(`[ReviewSyncService] Failed to save raw reviews for ${marketplace}`, error);
      throw error;
    }
  }

  /**
   * Close database connection when done
   */
  async disconnect() {
    await this.db.$disconnect();
  }
}
