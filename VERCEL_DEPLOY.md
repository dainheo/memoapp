# Vercel 배포 가이드

이 문서는 Memo App을 Vercel에 배포하는 방법을 설명합니다.

## 사전 준비

1. GitHub 저장소에 코드가 푸시되어 있어야 합니다.
2. [Vercel](https://vercel.com) 계정이 필요합니다 (GitHub 계정으로 로그인 가능).

## 배포 단계

### 1. Vercel에 프로젝트 추가

1. [Vercel Dashboard](https://vercel.com/dashboard)에 로그인
2. "Add New..." → "Project" 클릭
3. GitHub 저장소 목록에서 `dainheo/memoapp` 선택
4. "Import" 클릭

### 2. 프로젝트 설정

- **Framework Preset**: Next.js (자동 감지됨)
- **Root Directory**: `./` (기본값)
- **Build Command**: `npm run build` (기본값)
- **Output Directory**: `.next` (기본값)
- **Install Command**: `npm install` (기본값)

### 3. 환경 변수 설정

"Environment Variables" 섹션에서 다음 변수들을 추가하세요:

#### 필수 환경 변수

1. **DATABASE_URL**
   - Vercel에서는 SQLite를 직접 사용할 수 없으므로 PostgreSQL을 사용해야 합니다.
   - 옵션 1: Vercel Postgres 사용 (권장)
     - Vercel 대시보드에서 "Storage" 탭으로 이동
     - "Create Database" → "Postgres" 선택
     - 생성된 연결 문자열을 복사하여 `DATABASE_URL`에 설정
   - 옵션 2: 외부 데이터베이스 서비스 사용
     - [Supabase](https://supabase.com) (무료 티어 제공)
     - [PlanetScale](https://planetscale.com) (MySQL, 무료 티어 제공)
     - [Railway](https://railway.app) (PostgreSQL, 무료 티어 제공)

2. **NEXTAUTH_URL**
   - 배포 후 Vercel이 제공하는 도메인 (예: `https://memoapp-xxx.vercel.app`)
   - 또는 커스텀 도메인을 사용하는 경우 해당 도메인

3. **NEXTAUTH_SECRET**
   - 강력한 랜덤 문자열 생성
   - 터미널에서 다음 명령어 실행:
     ```bash
     openssl rand -base64 32
     ```
   - 또는 온라인 생성기 사용: https://generate-secret.vercel.app/32

### 4. 데이터베이스 스키마 변경 (PostgreSQL 사용 시)

Vercel Postgres를 사용하는 경우:

1. `prisma/schema.prisma` 파일 수정:
   ```prisma
   datasource db {
     provider = "postgresql"  // "sqlite"에서 변경
     url      = env("DATABASE_URL")
   }
   ```

2. 변경사항 커밋 및 푸시:
   ```bash
   git add prisma/schema.prisma
   git commit -m "Change database to PostgreSQL for Vercel"
   git push origin main
   ```

3. Vercel에서 자동으로 재배포됩니다.

### 5. 배포 실행

1. "Deploy" 버튼 클릭
2. 배포가 완료될 때까지 대기 (보통 2-3분)
3. 배포 완료 후 제공되는 URL로 접속하여 앱 확인

### 6. 데이터베이스 마이그레이션

배포 후 데이터베이스 스키마를 적용해야 합니다:

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Functions" → "Environment Variables" 확인
3. Vercel CLI를 사용하여 마이그레이션 실행:
   ```bash
   npm i -g vercel
   vercel login
   vercel link
   vercel env pull .env.local
   npx prisma migrate deploy
   ```

또는 Vercel의 "Deployments" 탭에서 최신 배포의 "Functions" 로그를 확인하여 자동 마이그레이션이 실행되었는지 확인하세요.

## 커스텀 도메인 설정 (선택사항)

1. Vercel 대시보드에서 프로젝트 선택
2. "Settings" → "Domains"
3. 원하는 도메인 입력
4. DNS 설정 안내에 따라 도메인 제공업체에서 DNS 레코드 추가

## 트러블슈팅

### 데이터베이스 연결 오류

- `DATABASE_URL`이 올바르게 설정되었는지 확인
- PostgreSQL 연결 문자열 형식 확인: `postgresql://user:password@host:port/database?sslmode=require`

### 인증 오류

- `NEXTAUTH_URL`이 배포된 도메인과 일치하는지 확인
- `NEXTAUTH_SECRET`이 설정되어 있는지 확인

### 빌드 오류

- Vercel 대시보드의 "Deployments" 탭에서 빌드 로그 확인
- 로컬에서 `npm run build`가 성공하는지 확인

## 추가 리소스

- [Vercel 공식 문서](https://vercel.com/docs)
- [Next.js 배포 가이드](https://nextjs.org/docs/deployment)
- [Prisma 배포 가이드](https://www.prisma.io/docs/guides/deployment)
