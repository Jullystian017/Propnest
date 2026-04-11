// =============================================
// PropNest AI — TypeScript Types
// =============================================

// ---- Developer / Auth ----
export interface Developer {
  id: string;
  company_name: string;
  phone_wa: string | null;
  logo_url: string | null;
  subscription_plan: 'basic' | 'pro' | 'premium';
  subscription_expires_at: string | null;
  created_at: string;
}

// ---- Listing ----
export interface ListingSpecs {
  luas_tanah?: number;
  luas_bangunan?: number;
  kamar_tidur?: number;
  kamar_mandi?: number;
  carport?: number;
  lantai?: number;
}

export type ListingType = 'rumah' | 'ruko' | 'kavling' | 'apartemen' | 'villa';
export type ListingStatus = 'active' | 'sold_out' | 'archived';

export interface Listing {
  id: string;
  developer_id: string;
  slug: string;
  name: string;
  type: ListingType;
  price_min: number;
  price_max: number | null;
  location_city: string;
  location_address: string;
  location_lat: number | null;
  location_lng: number | null;
  description: string | null;
  specs: ListingSpecs;
  facilities: string[];
  status: ListingStatus;
  is_featured: boolean;
  view_count: number;
  created_at: string;
  updated_at: string;
  // Joined
  developer?: Developer;
  photos?: ListingPhoto[];
}

export interface ListingPhoto {
  id: string;
  listing_id: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

// ---- Leads / CRM ----
export type LeadStatus =
  | 'inquiry'
  | 'interested'
  | 'survey'
  | 'negotiation'
  | 'closing';

export type LeadSource =
  | 'website'
  | 'instagram'
  | 'facebook'
  | 'tiktok'
  | 'whatsapp'
  | 'referral'
  | 'other';

export interface Lead {
  id: string;
  listing_id: string | null;
  developer_id: string;
  name: string;
  phone: string | null;
  email: string | null;
  message: string | null;
  status: LeadStatus;
  source: LeadSource;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  listing?: Listing;
}

// ---- Content / Posts ----
export type ContentPlatform = 'instagram' | 'facebook' | 'tiktok' | 'whatsapp';
export type ContentTone =
  | 'profesional'
  | 'santai'
  | 'urgensi'
  | 'storytelling';
export type ContentTemplate =
  | 'grand_launching'
  | 'promo_terbatas'
  | 'unit_terakhir'
  | 'lebaran'
  | 'info_kpr'
  | 'testimoni';
export type ContentStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface ContentPost {
  id: string;
  developer_id: string;
  listing_id: string | null;
  platform: ContentPlatform;
  caption: string;
  tone: ContentTone;
  template: ContentTemplate;
  scheduled_at: string | null;
  published_at: string | null;
  status: ContentStatus;
  created_at: string;
  // Joined
  listing?: Listing;
}

// ---- KPR Calculator ----
export interface KPRBank {
  name: string;
  logo: string;
  interest_rate: number; // % per tahun
  max_tenor: number; // tahun
  min_dp: number; // % DP minimum
  processing_fee: number; // %
}

export interface KPRResult {
  bank: KPRBank;
  monthly_installment: number;
  total_payment: number;
  dp_amount: number;
  loan_amount: number;
  eligible: boolean;
  eligibility_note?: string;
}

// ---- AI Content Generation ----
export interface GenerateCaptionRequest {
  listing: Listing;
  template: ContentTemplate;
  tone: ContentTone;
  platforms: ContentPlatform[];
  language: 'indonesia' | 'jawa_halus';
}

export interface GenerateCaptionResponse {
  captions: Record<ContentPlatform, string>;
}

// ---- Search & Filter ----
export interface ListingFilter {
  query?: string;
  city?: string;
  type?: ListingType;
  price_min?: number;
  price_max?: number;
  kamar_tidur?: number;
  has_kpr?: boolean;
  is_featured?: boolean;
  sort?: 'newest' | 'price_asc' | 'price_desc' | 'popular';
}

// ---- Subscription Plans ----
export interface SubscriptionPlan {
  id: 'basic' | 'pro' | 'premium';
  name: string;
  price: number;
  max_listings: number | null;
  features: string[];
}

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'basic',
    name: 'Basic',
    price: 299000,
    max_listings: 5,
    features: [
      '5 listing properti',
      'CRM leads dasar',
      'KPR simulator embed',
      'Analytics dasar',
      'Support email',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 799000,
    max_listings: 20,
    features: [
      '20 listing properti',
      'AI Caption Generator',
      'Auto posting IG, FB, TikTok',
      'Content calendar',
      'CRM full pipeline',
      'Laporan mingguan',
      '2 user tim',
      'Support WA Business',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 1990000,
    max_listings: null,
    features: [
      'Unlimited listing',
      'Semua fitur Pro',
      'Auto posting + WA Broadcast',
      'A/B Testing caption',
      'Watermark foto otomatis',
      'Laporan harian & bulanan',
      '5 user tim',
      'KPR simulator custom branded',
      'Dedicated WA support',
    ],
  },
];
