# 에디터 아키텍처 문서

## 📋 개요

이 문서는 Next.js 기반 블로그 프로젝트의 마크다운 에디터 시스템에 대한 상세한 아키텍처 설명입니다. Compound Component 패턴을 활용하여 재사용 가능하고 확장 가능한 에디터를 구현했습니다.

## 🏗️ 전체 아키텍처

### 핵심 설계 원칙
1. **Compound Component Pattern**: 복잡한 에디터를 작은 컴포넌트들로 분해
2. **Context API**: 에디터 상태와 함수들을 전역적으로 공유
3. **Custom Hooks**: 비즈니스 로직을 재사용 가능한 훅으로 분리
4. **State 기반 이미지 관리**: 임시 파일 대신 상태로 이미지 추적

### 컴포넌트 계층 구조
```
MarkdownEditor (Root)
├── MarkdownEditor.Toolbar
│   ├── HeadingButtons
│   ├── TextStyleButtons
│   ├── MediaButtons (이미지 업로드 포함)
│   ├── CodeButtons
│   └── ListButtons
├── MarkdownEditor.Input
└── MarkdownEditor.Preview
    ├── CodeComponent
    ├── TableComponents
    ├── TextComponents
    ├── HeadingComponents
    ├── ListComponents
    └── ImageComponent
```

## 🔧 핵심 컴포넌트 상세 분석

### 1. MarkdownEditor (Root Component)

**파일**: `components/editor/MarkdownEditor.tsx`

**역할**: 
- Compound Component의 루트 역할
- Context Provider로 에디터 상태 관리
- 게시글 ID 생성 및 관리

**주요 기능**:
```typescript
interface MarkdownEditorContextType {
  content: string;                    // 마크다운 콘텐츠
  setContent: (content: string) => void;
  textareaRef: React.RefObject<HTMLTextAreaElement | null>;
  previewRef: React.RefObject<HTMLDivElement | null>;
  syncScroll: () => void;            // 스크롤 동기화
  insertText: (text: string, cursorOffset?: number) => void;
  handleImageUpload: (file: File) => void;
  handleKeyDown: (e: React.KeyboardEvent) => void;
  showPreview: boolean;              // 미리보기 표시 여부
  setShowPreview: (show: boolean) => void;
  postId: string;                    // 게시글 ID
  isNewPost: boolean;                // 새 글 작성 여부
  getContent: () => string;          // 콘텐츠 가져오기
  onImageAdded: (fileName: string) => void; // 이미지 추가 추적
}
```

**Context 패턴 활용**:
- `MarkdownEditorContext`: 에디터 상태와 함수들을 전역적으로 공유
- `useMarkdownEditorContext`: Context 사용을 위한 커스텀 훅
- 각 하위 컴포넌트는 Context를 통해 필요한 상태와 함수에 접근

### 2. Custom Hooks

#### useMarkdownEditor
**파일**: `hooks/useMarkdownEditor.ts`

**역할**: 에디터의 핵심 상태와 로직 관리

**주요 기능**:
- **콘텐츠 관리**: `content`, `setContent`
- **스크롤 동기화**: `syncScroll()` - 입력창과 미리보기 스크롤 동기화
- **텍스트 삽입**: `insertText()` - 커서 위치에 텍스트 삽입
- **키보드 단축키**: `handleKeyDown()` - Ctrl+B (볼드), Ctrl+K (링크) 등
- **Ref 관리**: `textareaRef`, `previewRef`

**스크롤 동기화 로직**:
```typescript
const syncScroll = useCallback(() => {
  if (textareaRef.current && previewRef.current) {
    const textarea = textareaRef.current;
    const preview = previewRef.current;
    
    // 스크롤 비율 계산
    const scrollRatio = textarea.scrollTop / (textarea.scrollHeight - textarea.clientHeight);
    const targetScrollTop = scrollRatio * (preview.scrollHeight - preview.clientHeight);
    
    preview.scrollTop = targetScrollTop;
  }
}, []);
```

#### useToolbarActions
**파일**: `hooks/useToolbarActions.ts`

**역할**: 툴바 버튼들의 액션 처리

**주요 기능**:
- **헤딩**: `handleHeading(level)` - H1~H6 헤딩 삽입
- **텍스트 스타일**: `handleBold()`, `handleItalic()`, `handleStrikethrough()`
- **링크**: `handleLink()` - `[텍스트](URL)` 형태로 삽입
- **코드**: `handleCode()`, `handleCodeBlock()`
- **리스트**: `handleList()`, `handleOrderedList()`
- **이미지 업로드**: `handleImageUpload()` - 파일 업로드 및 마크다운 삽입

**이미지 업로드 로직**:
```typescript
const handleImageUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
  const file = event.target.files?.[0];
  if (!file || !postId) return;

  // FormData로 파일 업로드
  const formData = new FormData();
  formData.append('file', file);
  formData.append('postId', postId);
  formData.append('isTemp', 'false');

  const response = await fetch('/api/images/upload', {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();
  
  if (result.success) {
    onInsert(result.markdownImage, 0);  // 마크다운 문법 삽입
    onImageAdded?.(result.fileName);    // 새 이미지 추적
  }
}, [onInsert, postId, onImageAdded]);
```

#### useImageUpload
**파일**: `hooks/useImageUpload.ts`

**역할**: 이미지 업로드 상태 관리 및 정리

**주요 기능**:
- **새 이미지 추적**: `newImageNames` state로 새로 추가된 이미지 관리
- **이미지 추가/제거**: `addNewImage()`, `removeNewImage()`
- **정리 기능**: `cleanupImages()` - 취소 시 적절한 이미지 정리

**이미지 정리 로직**:
```typescript
const cleanupImages = useCallback(async (): Promise<boolean> => {
  const response = await fetch('/api/images/cleanup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      postId, 
      isNewPost,
      imageNames: isNewPost ? [] : newImageNames // 새 글: 전체 삭제, 수정: 새 이미지만 삭제
    }),
  });
  // ...
}, [postId, isNewPost, newImageNames]);
```

### 3. 툴바 컴포넌트들

#### MarkdownToolbar
**파일**: `components/editor/MarkdownToolbar.tsx`

**역할**: 툴바의 메인 컨테이너

**구조**:
```typescript
<div className="flex items-center gap-1 p-2 border-b">
  <HeadingButtons onHeading={handleHeading} />
  <ToolbarSeparator />
  <TextStyleButtons onBold={handleBold} onItalic={handleItalic} />
  <ToolbarSeparator />
  <MediaButtons onLink={handleLink} onImageUpload={handleImageUpload} />
  <ToolbarSeparator />
  <CodeButtons onCode={handleCode} onCodeBlock={handleCodeBlock} />
  <ToolbarSeparator />
  <ListButtons onList={handleList} onOrderedList={handleOrderedList} />
</div>
```

#### 개별 툴바 컴포넌트들
**파일**: `components/editor/toolbar/*.tsx`

각 버튼 그룹을 별도 컴포넌트로 분리:
- **HeadingButtons**: H1~H6 버튼
- **TextStyleButtons**: 볼드, 이탤릭, 취소선 버튼
- **MediaButtons**: 링크, 이미지 업로드 버튼
- **CodeButtons**: 인라인 코드, 코드 블록 버튼
- **ListButtons**: 순서 없는 리스트, 순서 있는 리스트, 인용 버튼
- **ToolbarSeparator**: 구분선

### 4. 입력 및 미리보기 컴포넌트

#### MarkdownInput
**파일**: `components/editor/MarkdownInput.tsx`

**역할**: 마크다운 텍스트 입력 영역

**주요 기능**:
- **실시간 스크롤 동기화**: `onScroll={syncScroll}`
- **키보드 단축키**: `onKeyDown={handleKeyDown}`
- **자동 리사이즈**: textarea 높이 자동 조절
- **다크모드 지원**: `darkModeAtom` 기반 스타일링

#### MarkdownPreview
**파일**: `components/editor/MarkdownPreview.tsx`

**역할**: 마크다운 미리보기 렌더링

**주요 기능**:
- **React Markdown**: `react-markdown` 라이브러리 사용
- **플러그인**: `remarkGfm`, `remarkBreaks`, `rehypeHighlight`, `rehypeRaw`
- **커스텀 컴포넌트**: 각 마크다운 요소별 전용 컴포넌트

**커스텀 컴포넌트 매핑**:
```typescript
const markdownComponents: Components = {
  code: CodeComponent,
  table: TableComponent,
  th: ThComponent,
  td: TdComponent,
  blockquote: BlockquoteComponent,
  a: LinkComponent,
  h1: H1Component,
  h2: H2Component,
  // ... 기타 컴포넌트들
};
```

### 5. 미리보기 서브 컴포넌트들

**파일**: `components/editor/preview/*.tsx`

각 마크다운 요소를 렌더링하는 전용 컴포넌트들:

#### CodeComponent
- **역할**: 인라인 코드 및 코드 블록 렌더링
- **기능**: 구문 강조, 복사 버튼, 다크모드 지원

#### TableComponents
- **역할**: 테이블 렌더링
- **구성**: `TableComponent`, `ThComponent`, `TdComponent`

#### TextComponents
- **역할**: 텍스트 관련 요소 렌더링
- **구성**: `BlockquoteComponent`, `LinkComponent`, `ParagraphComponent`, `StrongComponent`, `EmComponent`, `DelComponent`

#### HeadingComponents
- **역할**: 헤딩 요소 렌더링
- **구성**: `H1Component` ~ `H6Component`

#### ListComponents
- **역할**: 리스트 요소 렌더링
- **구성**: `UlComponent`, `OlComponent`, `LiComponent`

#### ImageComponent
- **역할**: 이미지 렌더링
- **기능**: 로딩 상태, 에러 처리, 다크모드 지원

## 🖼️ 이미지 관리 시스템

### 폴더 구조
```
public/
└── contents/
    ├── 20240101120000/          # 게시글 ID별 폴더
    │   ├── post.md              # 마크다운 파일
    │   └── images/              # 이미지 폴더
    │       ├── img_001.jpg
    │       └── img_002.png
    └── 20240101130000/
        ├── post.md
        └── images/
            └── img_001.jpg
```

### 이미지 업로드 플로우

1. **툴바에서 이미지 버튼 클릭**
2. **파일 선택**
3. **API 호출**: `/api/images/upload`
4. **파일 저장**: `public/contents/[postId]/images/[filename]`
5. **마크다운 삽입**: `![alt](/contents/[postId]/images/[filename])`
6. **상태 추적**: `newImageNames`에 파일명 추가

### 이미지 정리 로직

#### 새 글 작성 시
- **저장**: 사용된 이미지만 유지, 나머지 삭제
- **취소**: 전체 폴더 삭제

#### 글 수정 시
- **저장**: 사용된 이미지만 유지, 나머지 삭제
- **취소**: 새로 추가된 이미지만 삭제, 기존 이미지 유지

## 🔄 상태 관리

### Jotai Atoms
**파일**: `atoms/blogAtoms.ts`

```typescript
// 다크모드 상태
export const darkModeAtom = atom<boolean>(false);

// 인증 상태
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: Session['user'] | null;
  isAdmin: boolean;
}>({
  isAuthenticated: false,
  user: null,
  isAdmin: false,
});
```

### Context State
- **MarkdownEditorContext**: 에디터 전용 상태
- **SessionProvider**: NextAuth 세션 상태

## 🎨 스타일링 시스템

### Tailwind CSS + cn() 유틸리티
```typescript
import { cn } from '@/lib/utils';

// 조건부 스타일링
className={cn(
  'base-classes',
  {
    'dark-mode-classes': isDarkMode,
    'light-mode-classes': !isDarkMode,
  }
)}
```

### 다크모드 지원
- **Atom 기반**: `darkModeAtom`으로 전역 상태 관리
- **자동 적용**: 모든 컴포넌트에서 자동으로 다크모드 스타일 적용
- **일관성**: Tailwind의 `dark:` 접두사 활용

## 🚀 성능 최적화

### 1. 메모이제이션
- **useCallback**: 이벤트 핸들러들 메모이제이션
- **useMemo**: 복잡한 계산 결과 캐싱

### 2. 컴포넌트 분리
- **단일 책임**: 각 컴포넌트가 하나의 역할만 담당
- **재사용성**: 툴바 버튼들을 독립적인 컴포넌트로 분리

### 3. 지연 로딩
- **동적 import**: 필요시에만 컴포넌트 로드
- **코드 스플리팅**: 번들 크기 최적화

## 🔧 확장성

### 새로운 툴바 버튼 추가
1. `components/editor/toolbar/`에 새 컴포넌트 생성
2. `useToolbarActions`에 새 액션 추가
3. `MarkdownToolbar`에 새 컴포넌트 추가

### 새로운 마크다운 요소 지원
1. `components/editor/preview/`에 새 컴포넌트 생성
2. `MarkdownPreview`의 `markdownComponents`에 추가
3. 필요시 새로운 remark/rehype 플러그인 추가

## 🐛 에러 처리

### 이미지 업로드 에러
- **파일 타입 검증**: `isValidImageFile()`
- **파일 크기 검증**: `isValidImageSize()` (5MB 제한)
- **사용자 피드백**: alert로 에러 메시지 표시

### API 에러 처리
- **try-catch**: 모든 API 호출에 에러 처리
- **사용자 친화적 메시지**: 기술적 에러를 사용자에게 알기 쉬운 메시지로 변환

## 📱 반응형 디자인

### 그리드 레이아웃
```typescript
<div className={cn(
  'flex-1 grid mb-20',
  {
    'grid-cols-1 lg:grid-cols-2': showPreview,  // 데스크톱: 2열, 모바일: 1열
    'grid-cols-1': !showPreview,
  }
)}>
```

### 툴바 반응형
- **숨김 처리**: 작은 화면에서 일부 버튼 숨김
- **스크롤**: 툴바 버튼이 많을 때 가로 스크롤

## 🔮 향후 개선 방향

### 1. 기능 개선
- **자동 저장**: Draft.js 스타일의 자동 저장
- **협업 편집**: 실시간 협업 기능
- **버전 관리**: 편집 히스토리 관리

### 2. 성능 개선
- **가상화**: 긴 문서의 가상 스크롤링
- **지연 렌더링**: 미리보기 지연 렌더링
- **캐싱**: 이미지 및 콘텐츠 캐싱

### 3. 사용성 개선
- **드래그 앤 드롭**: 파일 드래그 앤 드롭 지원
- **키보드 단축키**: 더 많은 단축키 지원
- **플러그인 시스템**: 확장 가능한 플러그인 아키텍처

---

이 아키텍처는 확장 가능하고 유지보수가 용이한 에디터 시스템을 제공하며, 향후 기능 추가나 수정이 필요할 때 쉽게 대응할 수 있도록 설계되었습니다.
