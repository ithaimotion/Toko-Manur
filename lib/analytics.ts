import { BetaAnalyticsDataClient } from '@google-analytics/data';

// Singleton instance
let analyticsDataClient: BetaAnalyticsDataClient | null = null;

function getAnalyticsClient() {
  if (!analyticsDataClient) {
    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      console.warn('Missing Google Analytics credentials. Analytics will not load.');
      return null;
    }

    // Replace literal '\n' with actual newline characters
    const privateKey = process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n');

    analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: privateKey,
      },
    });
  }
  return analyticsDataClient;
}

export async function getMonthlyVisitors(): Promise<{ current: number, change: number }> {
  try {
    const client = getAnalyticsClient();
    const propertyId = process.env.GA_PROPERTY_ID;

    if (!client || !propertyId) {
      return { current: 0, change: 0 };
    }

    // Fetch this month (last 30 days) and previous month (31-60 days ago) for comparison
    const [response] = await client.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: '30daysAgo',
          endDate: 'today',
        },
        {
          startDate: '60daysAgo',
          endDate: '31daysAgo',
        }
      ],
      metrics: [
        {
          name: 'activeUsers', // Unique visitors
        },
      ],
    });

    // Parse the response
    const currentMonthUsers = parseInt(response.rows?.[0]?.metricValues?.[0]?.value || '0', 10);
    const previousMonthUsers = parseInt(response.rows?.[1]?.metricValues?.[0]?.value || '0', 10);

    // Calculate percentage change
    let change = 0;
    if (previousMonthUsers > 0) {
      change = Math.round(((currentMonthUsers - previousMonthUsers) / previousMonthUsers) * 100);
    } else if (currentMonthUsers > 0) {
      change = 100; // 100% increase if previous was 0 and current is > 0
    }

    return {
      current: currentMonthUsers,
      change: change
    };
  } catch (error) {
    console.error('Error fetching Google Analytics data:', error);
    return { current: 0, change: 0 };
  }
}
