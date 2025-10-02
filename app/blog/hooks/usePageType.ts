import { usePathname } from 'next/navigation';

export type PageType = 'list' | 'write' | 'edit' | 'detail';

export function usePageType() {
  const pathname = usePathname();
  
  const getCurrentPageType = (): PageType => {
    if (pathname === '/blog') return 'list';
    if (pathname === '/editor') return 'write';
    if (pathname?.startsWith('/editor/')) return 'edit';
    if (pathname?.startsWith('/blog/')) return 'detail';
    return 'list';
  };

  const currentPage = getCurrentPageType();
  const isWritingPage = currentPage === 'write' || currentPage === 'edit';

  return { currentPage, isWritingPage };
}

