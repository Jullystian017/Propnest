
export type PlanType = 'basic' | 'pro' | 'premium';

export interface PlanLimits {
  listings: number;
  aiCaptions: number;
  socialPlatforms: string[];
  features: {
    whatsappAlerts: boolean;
    autoReports: boolean;
    exportData: boolean;
    featuredListing: boolean; // Accessible as add-on, but maybe higher tiers get discounts
  };
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  basic: {
    listings: 5,
    aiCaptions: 10,
    socialPlatforms: [],
    features: {
      whatsappAlerts: false,
      autoReports: false,
      exportData: false,
      featuredListing: false,
    },
  },
  pro: {
    listings: 30,
    aiCaptions: 75,
    socialPlatforms: ['instagram', 'facebook'],
    features: {
      whatsappAlerts: false,
      autoReports: false,
      exportData: true,
      featuredListing: true,
    },
  },
  premium: {
    listings: 999999, // Unlimited
    aiCaptions: 999999, // Unlimited
    socialPlatforms: ['instagram', 'facebook', 'tiktok', 'twitter'],
    features: {
      whatsappAlerts: true,
      autoReports: true,
      exportData: true,
      featuredListing: true,
    },
  },
};

export const PLAN_PRICES: Record<PlanType, number> = {
  basic: 0,
  pro: 299000,
  premium: 999000,
};
