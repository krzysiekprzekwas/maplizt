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

export async function getInfluencerByUserId(userId: string) {
  const { data, error } = await supabase
    .from('influencers')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();

  if (error) throw error;
  return data as Influencer | null;
}

export async function updateInfluencerProfile(
  userId: string, 
  profileData: { name?: string; slug?: string; handle?: string; description?: string; profile_image?: string }
) {
  // First check if slug is already taken (except by the current user)
  if (profileData.slug) {
    const { data: existingSlug, error: slugError } = await supabase
      .from('influencers')
      .select('id')
      .eq('slug', profileData.slug)
      .neq('user_id', userId)
      .maybeSingle();

    if (slugError) throw slugError;
    if (existingSlug) throw new Error('This slug is already taken. Please choose another one.');
  }

  // Update the profile
  const { data, error } = await supabase
    .from('influencers')
    .update(profileData)
    .eq('user_id', userId)
    .select()
    .single();

  if (error) throw error;
  return data as Influencer;
}

export async function createInfluencerProfile(
  userId: string, 
  profileData: { name: string; slug: string; handle: string; description?: string; profile_image?: string }
) {
  // Check if slug is already taken
  const { data: existingSlug, error: slugError } = await supabase
    .from('influencers')
    .select('id')
    .eq('slug', profileData.slug)
    .maybeSingle();

  if (slugError) throw slugError;
  if (existingSlug) throw new Error('This slug is already taken. Please choose another one.');

  // Create the profile
  const { data, error } = await supabase
    .from('influencers')
    .insert({
      ...profileData,
      user_id: userId
    })
    .select()
    .single();

  if (error) throw error;
  return data as Influencer;
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

export async function getOrderDetails(orderId: string) {
  const { data, error } = await supabase
    .from('orders')
    .select('*, recommendations(*, influencers(*))')
    .eq('id', orderId)
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data as Order & {
    recommendations: Recommendation & {
      influencers: Influencer
    }
  };
}