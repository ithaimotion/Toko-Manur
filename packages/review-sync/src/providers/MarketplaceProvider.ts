import { Marketplace, Review } from '@toko-manur/db';

export interface ScrapedReview {
  reviewId: string;
  productName: string;
  username: string;
  rating: number;
  comment: string | null;
  reviewDate: Date;
  images: string[];
  videos: string[];
}

export interface MarketplaceProvider {
  /**
   * The marketplace this provider handles.
   */
  readonly marketplace: Marketplace;

  /**
   * Scrapes reviews for a given product URL.
   * @param productUrl The URL of the product to scrape reviews from.
   * @param maxReviews The maximum number of reviews to scrape (optional).
   * @returns An array of normalized reviews.
   */
  scrapeReviews(productUrl: string, maxReviews?: number): Promise<ScrapedReview[]>;
}
