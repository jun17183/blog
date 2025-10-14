import { atom } from 'jotai';

// 다크 모드 상태
export const darkModeAtom = atom(
  (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('darkMode');
      return saved ? JSON.parse(saved) : false;
    }
    return false;
  })(),
  (get, set, newValue?: boolean) => {
    const currentValue = get(darkModeAtom);
    const nextValue = newValue !== undefined ? newValue : !currentValue;
    set(darkModeAtom, nextValue);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', JSON.stringify(nextValue));
    }
  }
);

interface AuthState {
  isAuthenticated: boolean;
  user: {
    id?: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  } | null;
  isAdmin?: boolean;
}

export const authAtom = atom<AuthState>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
});

// 검색 섹션 표시 상태
export const showSearchAtom = atom(false);

// 태그 섹션 표시 상태
export const showTagsAtom = atom(false);

// 검색 쿼리
export const searchQueryAtom = atom('');

// 선택된 태그들
export const selectedTagsAtom = atom<string[]>([]);

// 검색/태그 섹션 토글 액션
export const toggleSearchAtom = atom(
  null,
  (get, set) => {
    const currentShowSearch = get(showSearchAtom);
    const currentShowTags = get(showTagsAtom);
    
    set(showSearchAtom, !currentShowSearch);
    
    // 검색을 켜면 태그는 끄기
    if (!currentShowSearch && currentShowTags) {
      set(showTagsAtom, false);
    }
  }
);

export const toggleTagsAtom = atom(
  null,
  (get, set) => {
    const currentShowTags = get(showTagsAtom);
    const currentShowSearch = get(showSearchAtom);
    
    set(showTagsAtom, !currentShowTags);
    
    // 태그를 켜면 검색은 끄기
    if (!currentShowTags && currentShowSearch) {
      set(showSearchAtom, false);
    }
  }
);

// 필터 초기화 액션
export const resetFiltersAtom = atom(
  null,
  (get, set) => {
    set(searchQueryAtom, '');
    set(selectedTagsAtom, []);
  }
);