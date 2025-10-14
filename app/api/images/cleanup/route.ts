import { NextRequest, NextResponse } from 'next/server';
import { deleteSpecificImages, deletePostImageDir } from '@/lib/imageUtils';

export async function POST(request: NextRequest) {
  try {
    const { postId, isNewPost, imageNames } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    if (isNewPost) {
      // 새 글 작성 취소: 전체 폴더 삭제
      await deletePostImageDir(postId);
    } else {
      // 글 수정 취소: 새로 추가된 이미지만 삭제
      if (imageNames && imageNames.length > 0) {
        await deleteSpecificImages(postId, imageNames);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: isNewPost ? 'Post directory deleted' : 'New images cleaned up' 
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
