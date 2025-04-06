import { supabase } from './supabase';
import { Database, Influencer, Recommendation } from '../types/database';

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
    .single();

  if (error) throw error;
  return data as Recommendation & { influencers: Influencer };
} 