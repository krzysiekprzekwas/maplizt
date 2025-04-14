export type Influencer = {
  id: string;
  user_id: string;
  slug: string;
  name: string;
  handle: string;
  profile_image: string;
  stripe_account_id?: string;
  stripe_account_status?: 'active' | 'pending';
  created_at: string;
  updated_at: string;
};

export type RecommendationType = "Free" | "Paid" | "Premium";

export type Recommendation = {
  id: string;
  slug: string;
  influencer_id: string;
  title: string;
  description: string;
  type: RecommendationType;
  numeric_price: number;
  images: string[];
  googleMapsLink: string;
  view_count: number;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  recommendation_id: string;
  email: string;
  card_number?: string;
  card_expiry?: string;
  card_cvc?: string;
  status: 'pending' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
};

export type Database = {
  public: {
    Tables: {
      influencers: {
        Row: Influencer;
        Insert: Omit<Influencer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Influencer, 'id' | 'created_at' | 'updated_at'>>;
      };
      recommendations: {
        Row: Recommendation;
        Insert: Omit<Recommendation, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Recommendation, 'id' | 'created_at' | 'updated_at'>>;
      };
      orders: {
        Row: Order;
        Insert: Omit<Order, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Order, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
};