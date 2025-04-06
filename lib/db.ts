import { supabase } from './supabase';
import { Database, Influencer, Recommendation, Order } from '../types/database';

export async function getInfluencers() {
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Influencer[];
}

export async function getInfluencer(slug: string) {
  const { data, error } = await supabase
    .from('influencers')
    .select('*, recommendations(*)')
    .eq('slug', slug)
    .maybeSingle();

  if (error) throw error;
  return data as Influencer & { recommendations: Recommendation[] };
}

export async function getRecommendation(influencerSlug: string, recommendationSlug: string) {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*, influencers(*)')
    .eq('influencers.slug', influencerSlug)
    .eq('slug', recommendationSlug)
    .maybeSingle();

  if (error) throw error;
  return data as Recommendation & { influencers: Influencer };
}

export async function createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('orders')
    .insert(orderData)
    .select()
    .single();

  if (error) throw error;
  return data as Order;
} 