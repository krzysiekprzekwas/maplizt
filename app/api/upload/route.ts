import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB in bytes

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    const {
      data: { user },
    } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPG, PNG, and WebP images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }

    // Generate a unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

    // Convert File to Buffer for Supabase storage
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let publicUrl: string = '';
    let uploadError: any = '';

    try {
      switch(type){

        case 'avatar':
          ({ error: uploadError } = await supabase.storage
            .from('influencer-avatars')
            .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
          }));
          ({ data: { publicUrl } } = supabase.storage
          .from('influencer-avatars')
          .getPublicUrl(fileName));
          break;
    
        case 'recommendation':
          ({ error: uploadError } = await supabase.storage
            .from('recommendation-images')
            .upload(fileName, buffer, {
            contentType: file.type,
            cacheControl: '3600',
          }));
          ({ data: { publicUrl } } = supabase.storage
          .from('recommendation-images')
          .getPublicUrl(fileName));
          break;
        }
    } catch(error) {
      console.error('Storage error:', error);
      return NextResponse.json(
        { error: 'Failed to upload file' },
        { status: 500 }
      );
    }

    if(uploadError)
      throw new Error('Failed to upload file');


    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 