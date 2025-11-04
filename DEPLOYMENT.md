# Vercel 배포 가이드

이 프로젝트는 로컬 환경과 Vercel 배포 환경 모두에서 작동하도록 설정되어 있습니다.

## 배포 전 준비사항

### 1. Google OAuth 설정

Google Cloud Console에서 OAuth 2.0 Redirect URI에 Vercel 도메인을 추가해야 합니다:

```
https://your-domain.vercel.app/api/auth/callback/google
```

### 2. Vercel 환경 변수 설정

Vercel 대시보드에서 다음 환경 변수를 설정하세요:

#### 단계별 설정 방법:

1. **Vercel 대시보드 접속**
   - https://vercel.com 접속
   - 로그인 후 해당 프로젝트 선택

2. **프로젝트 설정 페이지로 이동**
   - 프로젝트 대시보드에서 **Settings** 탭 클릭
   - 왼쪽 메뉴에서 **Environment Variables** 클릭

3. **환경 변수 추가**
   - **Add New** 버튼 클릭
   - 각 변수를 하나씩 추가:

| 변수명 | 값 예시 | 설명 |
|--------|---------|------|
| `NEXTAUTH_URL` | `https://your-domain.vercel.app` | 배포된 도메인 주소 (실제 Vercel 도메인 사용) |
| `NEXTAUTH_SECRET` | `랜덤 문자열` | NextAuth 암호화 키 (로컬 `.env.local`의 값 복사) |
| `GOOGLE_CLIENT_ID` | `실제 Client ID` | Google OAuth Client ID (로컬 `.env.local`의 값 복사) |
| `GOOGLE_CLIENT_SECRET` | `실제 Client Secret` | Google OAuth Client Secret (로컬 `.env.local`의 값 복사) |
| `ADMIN_EMAILS` | `jun17183@gmail.com` | 관리자 이메일 (쉼표로 구분 가능) |
| `BLOB_READ_WRITE_TOKEN` | (필수) | Vercel Blob Storage 토큰 |

**중요**: `BLOB_READ_WRITE_TOKEN` 설정 방법:
1. Vercel 대시보드 → 프로젝트 선택
2. **Storage** 탭 클릭
3. **Create Database** 클릭 (또는 기존 Blob Storage가 있으면 사용)
4. **Blob** 선택 후 생성
5. 생성된 Blob Storage의 **Settings** 탭에서 **Read and Write Token** 복사
6. **Settings** → **Environment Variables**에서 `BLOB_READ_WRITE_TOKEN` 추가
7. 값에 복사한 토큰 붙여넣기
8. **Production**, **Preview**, **Development** 모두 선택
9. **Save** 클릭
10. 재배포 필요

4. **환경 선택**
   - 각 변수 추가 시 **Production**, **Preview**, **Development** 모두 선택
   - **Save** 클릭

**중요**: 
- 모든 환경 변수를 **Production**, **Preview**, **Development** 환경에 적용하세요
- 환경 변수 추가 후 **재배포**가 필요합니다 (자동 재배포 또는 수동 재배포)

## 배포 방법

### 방법 1: GitHub 연동 (추천)

1. GitHub에 코드 푸시
2. Vercel 대시보드에서 **Import Project**
3. GitHub 저장소 선택
4. 환경 변수 설정
5. **Deploy** 클릭

### 방법 2: Vercel CLI

```bash
# Vercel CLI 설치
npm i -g vercel

# 로그인
vercel login

# 배포
vercel

# 프로덕션 배포
vercel --prod

# Vercel 환경 변수를 로컬로 가져오기 (로컬 개발용)
vercel env pull .env.local
```

## 환경별 동작 방식

### 로컬 환경 (Development)
- `NODE_ENV`: Next.js가 자동으로 `development` 설정 (`npm run dev` 실행 시)
- `NEXTAUTH_URL`: `http://localhost:3000`
- 이미지 도메인: `localhost` 포함
- Console 로그: 활성화

### Vercel 환경 (Production/Preview)
- `NODE_ENV`: Vercel이 자동으로 `production` 설정 (수동 설정 불필요)
- `VERCEL`: Vercel이 자동으로 `1` 설정 (Vercel 환경 감지용)
- `VERCEL_ENV`: Vercel이 자동으로 `production`, `preview`, `development` 중 하나로 설정
- `NEXTAUTH_URL`: Vercel 환경 변수에서 설정된 값 사용
- 이미지 도메인: `localhost` 제외 (자동으로 제외됨)
- Console 로그: 제거됨

**참고**: `NODE_ENV`는 Next.js와 Vercel이 자동으로 관리하므로 수동으로 설정할 필요가 없습니다.

## 배포 후 확인사항

1. **OAuth 로그인 테스트**
   - 배포된 사이트에서 Google 로그인 시도
   - 관리자 계정으로 로그인 확인

2. **이미지 업로드 테스트**
   - 에디터에서 이미지 업로드
   - 업로드된 이미지가 제대로 표시되는지 확인

3. **게시글 CRUD 테스트**
   - 게시글 작성, 수정, 삭제 기능 확인
   - 마크다운 렌더링 확인

## 문제 해결

### OAuth 에러
- Google Cloud Console의 Redirect URI 확인
- `NEXTAUTH_URL` 환경 변수가 올바른 도메인인지 확인

### 이미지 로드 실패
- `contents/[postId]/images/` 폴더가 존재하는지 확인
- Vercel 빌드 로그에서 이미지 파일 포함 여부 확인
- 이미지 URL이 `/api/images/[postId]/[fileName]` 형식인지 확인

### 환경 변수 에러
- Vercel 대시보드에서 모든 환경 변수가 설정되었는지 확인
- 환경 변수 변경 후 재배포 필요

## 참고사항

- `.env.local` 파일은 Git에 커밋되지 않습니다
- Vercel은 자동으로 HTTPS를 제공합니다
- 커스텀 도메인 사용 시 `NEXTAUTH_URL`을 커스텀 도메인으로 업데이트하세요
- Vercel에서는 대시보드에서 환경 변수를 관리하며, 파일로 관리하지 않습니다
- 로컬 개발 시: `.env.local` 파일을 만들고 실제 값 입력 (아래 환경 변수 목록 참고)
- Vercel CLI 사용 시: `vercel env pull .env.local`로 Vercel의 환경 변수를 로컬로 가져올 수 있습니다

## 필요한 환경 변수 목록

로컬 개발 시 `.env.local` 파일에 다음 변수들을 설정하세요:

- `NEXTAUTH_URL`: `http://localhost:3000`
- `NEXTAUTH_SECRET`: NextAuth 암호화 키 (생성: `openssl rand -base64 32`)
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret
- `ADMIN_EMAILS`: 관리자 이메일 (쉼표로 구분)
