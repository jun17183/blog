/**
 * 게시글 ID 생성 유틸리티
 */

/**
 * 정식 게시글 ID 생성 (YYYYMMDDHHMMSS 형식)
 */
export function generatePostId(): string {
  const now = new Date();
  return now.getFullYear().toString() +
    (now.getMonth() + 1).toString().padStart(2, '0') +
    now.getDate().toString().padStart(2, '0') +
    now.getHours().toString().padStart(2, '0') +
    now.getMinutes().toString().padStart(2, '0') +
    now.getSeconds().toString().padStart(2, '0');
}

/**
 * 기본 slug 생성 (클라이언트에서 사용)
 */
export function generateSlug(title: string): string {
  let baseSlug = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!baseSlug) {
    baseSlug = 'untitled';
  }

  return baseSlug;
}

/**
 * 임시 게시글 ID 생성 (작성 중인 글용)
 */
export function generateTempPostId(): string {
  return Date.now().toString();
}
