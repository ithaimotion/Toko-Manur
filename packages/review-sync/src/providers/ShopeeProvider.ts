import { Marketplace } from '@toko-manur/db';
import { MarketplaceProvider, ScrapedReview } from './MarketplaceProvider';

// Pool of realistic desktop User-Agents to rotate
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
];

// Human-like random delay
const randomDelay = (min: number, max: number) =>
  new Promise(r => setTimeout(r, Math.floor(Math.random() * (max - min + 1)) + min));

export class ShopeeProvider implements MarketplaceProvider {
  readonly marketplace = Marketplace.SHOPEE;

  async scrapeReviews(productUrl: string, maxReviews: number = 10): Promise<ScrapedReview[]> {
    console.log(`[ShopeeProvider] Scraping up to ${maxReviews} reviews from ${productUrl}`);
    const reviews: ScrapedReview[] = [];

    // Use plain playwright with manual stealth techniques (more reliable than playwright-extra)
    const { chromium } = await import('playwright');

    const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];

    const browser = await chromium.launch({
      headless: true, // we keep it true for background running, but using real chrome helps
      executablePath: '/usr/bin/google-chrome', // Use real Chrome to bypass anti-bot
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-blink-features=AutomationControlled',
        '--disable-infobars',
        '--window-size=1366,768',
        '--disable-gpu',
        '--lang=id-ID',
      ],
    });

    try {
      const context = await browser.newContext({
        userAgent,
        viewport: { width: 1366, height: 768 },
        locale: 'id-ID',
        timezoneId: 'Asia/Jakarta',
        extraHTTPHeaders: {
          'Accept-Language': 'id-ID,id;q=0.9,en-US;q=0.8,en;q=0.7',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
          'sec-ch-ua': '"Chromium";v="125", "Not.A/Brand";v="24", "Google Chrome";v="125"',
          'sec-ch-ua-mobile': '?0',
          'sec-ch-ua-platform': '"Windows"',
        },
      });

      const page = await context.newPage();

      // Manual stealth: Override automation-detection properties
      await page.addInitScript(() => {
        // Hide webdriver flag
        Object.defineProperty(navigator, 'webdriver', { get: () => undefined });

        // Fake plugins (real browsers have plugins, headless don't)
        Object.defineProperty(navigator, 'plugins', {
          get: () => {
            const plugins: any = [
              { name: 'Chrome PDF Plugin', filename: 'internal-pdf-viewer' },
              { name: 'Chrome PDF Viewer', filename: 'mhjfbmdgcfjbbpaeojofohoefgiehjai' },
              { name: 'Native Client', filename: 'internal-nacl-plugin' },
            ];
            plugins.length = 3;
            plugins.item = (i: number) => plugins[i];
            plugins.namedItem = (name: string) => plugins.find((p: any) => p.name === name);
            plugins.refresh = () => {};
            return plugins;
          }
        });

        // Fake languages
        Object.defineProperty(navigator, 'languages', {
          get: () => ['id-ID', 'id', 'en-US', 'en'],
        });

        // Fake chrome object (headless doesn't have window.chrome by default)
        (window as any).chrome = {
          runtime: {
            onConnect: { addListener: () => {} },
            onMessage: { addListener: () => {} },
          },
          loadTimes: () => ({}),
          csi: () => ({}),
          app: {},
        };

        // Prevent iframe detection
        Object.defineProperty(HTMLIFrameElement.prototype, 'contentWindow', {
          get: function() { return window; }
        });

        // Spoof screen dimensions
        Object.defineProperty(screen, 'width', { get: () => 1366 });
        Object.defineProperty(screen, 'height', { get: () => 768 });
      });

      console.log(`[ShopeeProvider] Navigating to product page...`);
      await page.goto(productUrl, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await randomDelay(2500, 4000);

      // Handle Language Selection Modal if it appears
      try {
        const langBtn = page.locator('button', { hasText: 'Bahasa Indonesia' });
        if (await langBtn.count() > 0) {
          console.log(`[ShopeeProvider] Language popup detected, clicking Bahasa Indonesia...`);
          await langBtn.first().click();
          await randomDelay(2000, 3000);
        }
      } catch (e) {
        console.log(`[ShopeeProvider] No language popup detected.`);
      }

      // Simulate mouse movement (humans move mouse, bots don't)
      await page.mouse.move(400 + Math.random() * 200, 200 + Math.random() * 100);
      await randomDelay(500, 1200);

      // Slow human-like scroll - extended to make sure we hit the bottom where reviews are lazy-loaded
      await page.evaluate(async () => {
        await new Promise<void>((resolve) => {
          let scrolled = 0;
          const distance = 250;
          let retries = 0;
          const interval = setInterval(() => {
            const previousHeight = document.body.scrollHeight;
            window.scrollBy(0, distance);
            scrolled += distance;
            
            // If we've scrolled past the current height, it might be lazy loading new content
            if (scrolled >= previousHeight) {
              retries++;
              if (retries > 15) { // Wait for up to ~3 seconds of no new content
                clearInterval(interval);
                resolve();
              }
            } else {
              retries = 0; // Reset retries if we are still scrolling
            }
          }, 200);
        });
      });

      console.log(`[ShopeeProvider] Finished scrolling, waiting for content to settle...`);
      await randomDelay(4000, 6000);

      // Try to find review elements with a much longer timeout (since user said it's loading slowly)
      try {
        console.log(`[ShopeeProvider] Waiting for reviews to load (timeout 45s)...`);
        await page.waitForSelector('.shopee-product-rating', { timeout: 45000 });
      } catch (e) {
        const currentUrl = page.url();
        const pageTitle = await page.title();
        console.warn(`[ShopeeProvider] Reviews not found. URL: ${currentUrl}, Title: ${pageTitle}`);
        // Save HTML for debugging - helps identify the correct CSS selectors
        const html = await page.content();
        const fs = await import('fs');
        const debugPath = `/tmp/shopee-debug-${Date.now()}`;
        fs.writeFileSync(`${debugPath}.html`, html);
        await page.screenshot({ path: `${debugPath}.png`, fullPage: false });
        console.warn(`[ShopeeProvider] Debug files saved: ${debugPath}.html & ${debugPath}.png`);
        // Log all class names found on page to help identify review container
        const classes = await page.evaluate(() => {
          const els = document.querySelectorAll('[class*="rating"], [class*="review"], [class*="ulasan"]');
          return Array.from(els).map(el => el.className).slice(0, 30);
        });
        console.warn(`[ShopeeProvider] Found classes with rating/review/ulasan:`, classes);
        return reviews;
      }

      const productName = await page.title().then(t => t.split('|')[0].trim());
      const reviewElements = await page.$$('.shopee-product-rating');
      console.log(`[ShopeeProvider] Found ${reviewElements.length} review elements`);

      for (let i = 0; i < Math.min(reviewElements.length, maxReviews); i++) {
        const el = reviewElements[i];
        await randomDelay(150, 500);

        const username = await el.$eval('.shopee-product-rating__author-name',
          n => n.textContent?.trim() || 'Unknown'
        ).catch(() => 'Unknown');

        const comment = await el.$eval('.shopee-product-rating__content',
          n => n.textContent?.trim() || ''
        ).catch(() => null);

        const rating = await el.$$('.icon-rating-solid')
          .then(stars => stars.length).catch(() => 5);

        const timeText = await el.$eval('.shopee-product-rating__time',
          n => n.textContent?.trim() || ''
        ).catch(() => '');

        let reviewDate = new Date();
        if (timeText) {
          const parsed = new Date(timeText.split(' ')[0]);
          if (!isNaN(parsed.getTime())) reviewDate = parsed;
        }

        const reviewId = Buffer.from(`shopee-${username}-${timeText}-${i}`)
          .toString('base64').substring(0, 24);

        reviews.push({ reviewId, productName, username, rating, comment, reviewDate, images: [], videos: [] });
      }

      console.log(`[ShopeeProvider] Successfully scraped ${reviews.length} reviews`);
    } catch (error) {
      console.error(`[ShopeeProvider] Error:`, error);
      throw error;
    } finally {
      await browser.close();
    }

    return reviews;
  }
}
