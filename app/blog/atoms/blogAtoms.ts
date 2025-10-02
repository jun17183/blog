import { atom } from 'jotai';

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
