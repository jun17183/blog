import { NextRequest, NextResponse } from 'next/server';
import { deleteImageFromPublic } from '@/lib/simpleImageStorage';

export async function DELETE(request: NextRequest) {
  try {
    const { postId, fileName } = await request.json();

    if (!postId || !fileName) {
      return NextResponse.json({ error: 'Missing postId or fileName' }, { status: 400 });
    }

    const success = await deleteImageFromPublic(postId, fileName);
    
    if (success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ success: true, message: 'File not found or already deleted' });
    }

  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
