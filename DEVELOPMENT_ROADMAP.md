# My Blog 개발 로드맵

## 📋 프로젝트 개요

Next.js 15.5.4 기반의 개인 블로그 프로젝트로, 마크다운 에디터와 파일 시스템 기반 컨텐츠 관리를 특징으로 합니다.

## 🏗️ 현재 상태 분석

### 기술 스택
- **Frontend**: Next.js 15.5.4 (App Router), React 19.1.0
- **상태관리**: Jotai
- **스타일링**: Tailwind CSS
- **마크다운**: React Markdown + remark/rehype 플러그인
- **아이콘**: Lucide React
- **언어**: TypeScript

### 현재 구조
```
my-blog/
├── app/                    # Next.js App Router
│   ├── blog/              # 블로그 페이지들
│   ├── editor/            # 에디터 페이지들
│   └── layout.tsx         # 루트 레이아웃
├── components/            # 재사용 컴포넌트
│   ├── blog/              # 블로그 관련 컴포넌트
│   ├── editor/            # 에디터 관련 컴포넌트
│   └── common/            # 공통 컴포넌트
├── atoms/                 # Jotai 상태 관리
├── hooks/                 # 커스텀 훅
└── lib/                   # 유틸리티 함수
```

### 코드 컨벤션
- **네이밍**: camelCase (변수/함수), PascalCase (컴포넌트)
- **아키텍처**: 컴포넌트 기반, Atomic Design 패턴
- **스타일링**: Tailwind CSS + cn() 유틸리티
- **상태관리**: Jotai atoms 패턴

## 🎯 개발 계획

### Phase 1: 코드 리팩토링 및 정리

#### 1.1 MarkdownEditor Compound Component 리팩토링
**목표**: 복잡한 MarkdownEditor(422줄)를 Compound Component 패턴으로 리팩토링

**현재 문제점**:
- 단일 컴포넌트에 너무 많은 책임 집중
- 툴바와 에디터, 미리보기가 강하게 결합됨
- 재사용성과 테스트 용이성 부족

**리팩토링 방향**:
```tsx
// 목표 구조
<MarkdownEditor>
  <MarkdownEditor.Toolbar onInsert={handleInsert} />
  <MarkdownEditor.Input value={content} onChange={setContent} />
  <MarkdownEditor.Preview content={content} />
</MarkdownEditor>
```

**세부 작업**:
- [ ] `MarkdownEditor`를 Compound Component로 분리
- [ ] `MarkdownToolbar`의 복잡한 로직을 개별 컴포넌트로 분리
- [ ] 에디터 관련 커스텀 훅 분리 (`useMarkdownEditor`, `useToolbarActions`)
- [ ] 스크롤 동기화 로직 최적화

**성공 기준**:
- [ ] 코드 라인 수 30% 이상 감소
- [ ] 각 컴포넌트의 단일 책임 원칙 준수
- [ ] 재사용 가능한 구조로 개선

#### 1.2 기타 컴포넌트 정리
**작업 내용**:
- [ ] 공통 UI 컴포넌트 일관성 확보
- [ ] 불필요한 props drilling 제거
- [ ] 컴포넌트별 타입 정의 개선

### Phase 2: 인증 시스템 구현

#### 2.1 Google OAuth 로그인 시스템
**목표**: 간단한 구글 계정 기반 로그인 및 관리자 권한 관리

**구현 사항**:
- [ ] `/login` 라우팅 페이지 생성
- [ ] Google OAuth 인증 연동
- [ ] 세션/토큰 관리 시스템
- [ ] 관리자 권한 확인 미들웨어

**기술 선택**:
- **옵션 1**: NextAuth.js (권장)
- **옵션 2**: 직접 Google OAuth 구현

**파일 구조**:
```
app/
├── login/
│   └── page.tsx          # 로그인 페이지
├── api/
│   └── auth/
│       └── [...nextauth]/
│           └── route.ts  # NextAuth 설정
└── middleware.ts         # 인증 미들웨어
```

**상태 관리**:
```typescript
// atoms/authAtoms.ts
export const authAtom = atom<{
  isAuthenticated: boolean;
  user: User | null;
  isAdmin: boolean;
}>({
  isAuthenticated: false,
  user: null,
  isAdmin: false
});
```

#### 2.2 권한 기반 UI 제어
**구현 사항**:
- [ ] `/editor` 접근 권한 제어
- [ ] 블로그에서 관리자일 때만 '새 글 작성', '수정하기' 버튼 표시
- [ ] 로그인 상태에 따른 리다이렉트 처리

### Phase 3: 파일 시스템 기반 컨텐츠 관리

#### 3.1 폴더 구조 설계
**목표**: 마크다운 파일과 이미지를 체계적으로 관리

**폴더 구조**:
```
public/
├── contents/             # 마크다운 파일들
│   ├── 20240101120000.md
│   ├── 20240101130000.md
│   └── ...
└── contents-image/       # 이미지 파일들
    ├── 20240101120000/   # 게시글 ID별 폴더
    │   ├── img_001.jpg
    │   ├── img_002.png
    │   └── ...
    └── 20240101130000/
        └── ...
```

**게시글 ID 생성 규칙**:
- 형식: `YYYYMMDDHHMMSS` (timestamp 기반)
- 예시: `20240101120000` (2024년 1월 1일 12시 00분 00초)

#### 3.2 API 엔드포인트 구현
**필요한 API**:
```
/api/posts
├── GET    /api/posts           # 게시글 목록 조회
├── GET    /api/posts/[id]      # 특정 게시글 조회
├── POST   /api/posts           # 게시글 생성
├── PUT    /api/posts/[id]      # 게시글 수정
└── DELETE /api/posts/[id]      # 게시글 삭제

/api/images
├── POST   /api/images/upload   # 이미지 업로드
├── GET    /api/images/[id]     # 이미지 조회
└── DELETE /api/images/[id]     # 이미지 삭제
```

#### 3.3 마크다운 메타데이터 처리
**Frontmatter 형식**:
```yaml
---
title: "게시글 제목"
slug: "url-friendly-slug"
date: "2024-01-01"
tags: ["tag1", "tag2"]
excerpt: "게시글 요약"
thumbnail: "/contents-image/20240101120000/thumb.jpg"
published: true
---
```

### Phase 4: 이미지 처리 시스템

#### 4.1 실시간 이미지 업로드
**구현 사항**:
- [ ] 드래그 앤 드롭 이미지 업로드
- [ ] 업로드 즉시 에디터에서 미리보기
- [ ] 자동 마크다운 문법 삽입
- [ ] 이미지 최적화 (리사이징, 압축)

**이미지 처리 플로우**:
1. 사용자가 이미지 드래그 앤 드롭
2. 임시 폴더에 업로드 (`/temp/{sessionId}/`)
3. 에디터에 마크다운 문법으로 삽입
4. 게시글 저장 시 최종 폴더로 이동
5. 게시글 취소 시 임시 파일 정리

#### 4.2 이미지 관리 전략
**작성 중**:
- 임시 폴더에 저장
- 세션 기반 관리
- 작성 취소 시 자동 정리

**수정 시**:
- 기존 이미지와 새 이미지 비교
- 사용하지 않는 이미지 정리
- 기존 폴더 유지 또는 새 폴더 생성

### Phase 5: 게시글 관리 시스템

#### 5.1 검색 및 필터링
**구현 사항**:
- [ ] 제목/내용 기반 검색
- [ ] 태그별 필터링
- [ ] 작성일 기준 정렬
- [ ] 태그별 게시글 수 표시

**검색 알고리즘**:
- 파일 시스템 기반 검색
- 마크다운 파싱을 통한 내용 검색
- 태그 인덱싱

#### 5.2 썸네일 시스템
**구현 방안**:
- [ ] 게시글 첫 번째 이미지를 썸네일로 사용
- [ ] 이미지가 없을 경우 기본 썸네일
- [ ] 썸네일 자동 생성 및 최적화

### Phase 6: SEO 및 성능 최적화

#### 6.1 SEO 최적화
**구현 사항**:
- [ ] 메타 태그 및 OpenGraph 설정
- [ ] 사이트맵 자동 생성
- [ ] 구조화된 데이터 (JSON-LD)
- [ ] RSS 피드 생성

#### 6.2 성능 최적화
**구현 사항**:
- [ ] 이미지 lazy loading
- [ ] 페이지네이션 또는 무한 스크롤
- [ ] 정적 생성 (Static Generation)
- [ ] 캐싱 전략

## 🚀 우선순위 및 일정

### 1주차: 코드 리팩토링
- [ ] MarkdownEditor Compound Component 리팩토링
- [ ] 기타 컴포넌트 정리
- [ ] 타입 정의 개선

### 2주차: 인증 시스템
- [ ] Google OAuth 연동
- [ ] 세션 관리 구현
- [ ] 권한 기반 UI 제어

### 3주차: 컨텐츠 관리
- [ ] 파일 시스템 구조 설계
- [ ] API 엔드포인트 구현
- [ ] 마크다운 메타데이터 처리

### 4주차: 이미지 처리
- [ ] 이미지 업로드 시스템
- [ ] 드래그 앤 드롭 구현
- [ ] 이미지 최적화

### 5주차: 게시글 관리
- [ ] 검색 기능 구현
- [ ] 태그 시스템 완성
- [ ] 썸네일 시스템

### 6주차: 최적화 및 배포
- [ ] SEO 최적화
- [ ] 성능 최적화
- [ ] 배포 준비

## 🔧 기술적 고려사항

### 데이터 저장 방식
**현재 계획**: 파일 시스템 기반
**장점**: 
- 간단한 구조
- Git으로 버전 관리 가능
- 서버리스 환경에서도 동작

**단점**:
- 검색 성능 제한
- 복잡한 쿼리 어려움

**대안**: SQLite + 파일 시스템 하이브리드

### 보안 고려사항
- [ ] XSS 방지를 위한 마크다운 sanitization
- [ ] 이미지 업로드 시 파일 타입/크기 제한
- [ ] Rate limiting 구현
- [ ] 관리자 권한 검증

### 배포 전략
**옵션 1**: Vercel (권장)
- Next.js 최적화
- 자동 배포
- 파일 업로드 제한 있음

**옵션 2**: VPS + Docker
- 완전한 제어
- 파일 업로드 자유
- 관리 복잡도 증가

## 📝 추가 기능 (선택사항)

### 필수 기능
- [ ] 댓글 시스템
- [ ] RSS 피드
- [ ] 다크모드 (이미 구현됨)

### 선택 기능
- [ ] 다국어 지원
- [ ] Google Analytics 연동
- [ ] 소셜 공유 기능
- [ ] 게시글 좋아요/북마크
- [ ] 관리자 대시보드

## 🎯 성공 지표

### 기술적 지표
- [ ] 페이지 로딩 속도 3초 이내
- [ ] 모바일 반응형 완벽 지원
- [ ] SEO 점수 90점 이상
- [ ] 접근성 점수 95점 이상

### 사용성 지표
- [ ] 직관적인 에디터 사용성
- [ ] 빠른 이미지 업로드 (5초 이내)
- [ ] 정확한 검색 결과
- [ ] 안정적인 인증 시스템

---

*이 문서는 프로젝트 진행에 따라 지속적으로 업데이트됩니다.*
