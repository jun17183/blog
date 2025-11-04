import { NextRequest, NextResponse } from 'next/server';
import { deletePostImagesFromPublic, deleteImageFromPublic } from '@/lib/simpleImageStorage';

export async function POST(request: NextRequest) {
  try {
    const { postId, isNewPost, imageNames } = await request.json();

    if (!postId) {
      return NextResponse.json({ error: 'Missing postId' }, { status: 400 });
    }

    if (isNewPost) {
      // 새 글 작성 취소: 전체 폴더 삭제
      await deletePostImagesFromPublic(postId);
    } else {
      // 글 수정 취소: 새로 추가된 이미지만 삭제
      if (imageNames && imageNames.length > 0) {
        const deletePromises = imageNames.map((fileName: string) => 
          deleteImageFromPublic(postId, fileName)
        );
        await Promise.all(deletePromises);
      }
    }

    return NextResponse.json({ 
      success: true, 
      message: isNewPost ? 'Post images deleted' : 'New images cleaned up' 
    });

  } catch (error) {
    console.error('Cleanup error:', error);
    return NextResponse.json({ error: 'Cleanup failed' }, { status: 500 });
  }
}
