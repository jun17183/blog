import { NextRequest, NextResponse } from 'next/server';
import { rm } from 'fs/promises';
import { join } from 'path';

export async function DELETE(request: NextRequest) {
  try {
    const { postId, fileName } = await request.json();

    if (!postId || !fileName) {
      return NextResponse.json({ error: 'Missing postId or fileName' }, { status: 400 });
    }

    const filePath = join(process.cwd(), 'contents', postId, 'images', fileName);
    
    try {
      await rm(filePath, { force: true });
      return NextResponse.json({ success: true });
    } catch {
      // 파일이 이미 삭제되었거나 존재하지 않는 경우
      return NextResponse.json({ success: true, message: 'File not found or already deleted' });
    }

  } catch (error) {
    console.error('Image delete error:', error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
