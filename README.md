This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## 개인 블로그 프로젝트

Next.js 15.5.4 기반의 개인 블로그로, 마크다운 에디터와 Google OAuth 인증을 지원합니다.

## 환경 설정

### 1. 환경 변수 설정

프로젝트 루트에 `.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# Google OAuth 설정
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# NextAuth 설정
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_here

# 관리자 이메일 (쉼표로 구분)
ADMIN_EMAILS=your_email@gmail.com,another_admin@gmail.com
```

### 2. Google OAuth 설정 (상세 가이드)

#### 2.1 Google Cloud Console 프로젝트 생성
1. [Google Cloud Console](https://console.cloud.google.com/)에 접속
2. 새 프로젝트 생성 또는 기존 프로젝트 선택
3. 프로젝트 이름을 입력하고 생성

#### 2.2 OAuth 동의 화면 설정
1. 좌측 메뉴에서 "APIs & Services" > "OAuth consent screen" 선택
2. "External" 선택 (개인 사용자용)
3. 필수 정보 입력:
   - App name: `jun17183 blog`
   - User support email: 본인 이메일
   - Developer contact information: 본인 이메일
4. "Save and Continue" 클릭
5. Scopes는 기본값으로 두고 "Save and Continue"
6. Test users에 본인 이메일 추가 (개발 단계에서 필요)

#### 2.3 OAuth 2.0 클라이언트 ID 생성
1. "APIs & Services" > "Credentials" 선택
2. "Create Credentials" > "OAuth 2.0 Client ID" 선택
3. Application type: "Web application"
4. Name: `jun17183 blog client`
5. Authorized redirect URIs에 다음 추가:
   - `http://localhost:3000/api/auth/callback/google` (개발용)
   - `https://yourdomain.com/api/auth/callback/google` (배포용)
6. "Create" 클릭
7. 생성된 Client ID와 Client Secret을 복사

#### 2.4 환경 변수에 설정
```bash
GOOGLE_CLIENT_ID=123456789-abcdefghijklmnop.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=GOCSPX-abcdefghijklmnopqrstuvwxyz
```

### 3. NextAuth Secret 생성

보안을 위해 강력한 시크릿 키를 생성하세요:

#### Windows (PowerShell):
```powershell
[System.Web.Security.Membership]::GeneratePassword(32, 0)
```

#### macOS/Linux:
```bash
openssl rand -base64 32
```

#### 온라인 생성기:
- [NextAuth.js Secret Generator](https://generate-secret.vercel.app/32)

생성된 시크릿을 환경 변수에 설정:
```bash
NEXTAUTH_SECRET=your_generated_secret_here
```

### 4. 관리자 이메일 설정

블로그 관리 권한을 가질 이메일 주소들을 설정하세요:

```bash
# 단일 관리자
ADMIN_EMAILS=your_email@gmail.com

# 여러 관리자 (쉼표로 구분)
ADMIN_EMAILS=admin1@gmail.com,admin2@gmail.com,admin3@gmail.com
```

### 5. 설정 확인

모든 환경 변수가 올바르게 설정되었는지 확인:

```bash
# .env.local 파일 내용 확인
cat .env.local

# 또는 Windows에서
type .env.local
```

### 6. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 `http://localhost:3000`에 접속하여 정상 작동하는지 확인하세요.

### 7. 로그인 테스트

1. `http://localhost:3000/login`에 접속
2. "Google로 로그인" 버튼 클릭
3. Google 계정으로 로그인
4. 로그인 후 블로그로 리다이렉트되는지 확인
5. 관리자 계정인 경우 헤더에 "새 글 작성" 버튼이 표시되는지 확인

### 8. 문제 해결

#### 로그인 시 에러가 발생하는 경우:
1. Google Cloud Console에서 OAuth 동의 화면이 "Testing" 상태인지 확인
2. Test users에 본인 이메일이 추가되어 있는지 확인
3. 리디렉션 URI가 정확한지 확인
4. 환경 변수가 올바르게 설정되었는지 확인

#### 관리자 권한이 작동하지 않는 경우:
1. `ADMIN_EMAILS`에 사용하는 Google 계정 이메일이 정확히 입력되었는지 확인
2. 이메일 주소에 공백이나 대소문자 오타가 없는지 확인
3. 브라우저 캐시를 지우고 다시 로그인 시도

## Getting Started

First, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
