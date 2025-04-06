export type Influencer = {
  id: string;
  slug: string;
  name: string;
  handle: string;
  description: string;
  profile_image: string;
  created_at: string;
  updated_at: string;
};

export type Recommendation = {
  id: string;
  slug: string;
  influencer_id: string;
  title: string;
  description: string;
  type: string;
  numeric_price: number;
  image_url: string;
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
    };
  };
}; 