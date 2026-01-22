# Memo App - 나의 메모 앱

간단하고 아름다운 메모 앱입니다. Next.js, Prisma, NextAuth.js를 사용하여 구축되었습니다.

## 주요 기능

- ✅ 사용자 인증 (회원가입, 로그인, 로그아웃)
- ✅ 메모 생성, 수정, 삭제
- ✅ 메모 검색
- ✅ 색상별 메모 분류
- ✅ 반응형 디자인

## 기술 스택

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite (Prisma ORM)
- **Authentication**: NextAuth.js
- **Deployment**: Vercel

## 시작하기

### 1. 저장소 클론

```bash
git clone https://github.com/dainheo/memoapp.git
cd memoapp
```

### 2. 의존성 설치

```bash
npm install
```

### 3. 환경 변수 설정

`.env.example` 파일을 `.env`로 복사하고 필요한 값들을 설정하세요:

```bash
cp .env.example .env
```

`.env` 파일을 열어서 다음 값들을 설정하세요:

```env
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-this-in-production"
```

**중요**: `NEXTAUTH_SECRET`은 프로덕션 환경에서 반드시 강력한 랜덤 문자열로 변경하세요.

### 4. 데이터베이스 설정

```bash
npx prisma generate
npx prisma db push
```

### 5. 개발 서버 실행

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000)을 열어 앱을 확인하세요.

## Vercel 배포

### 1. GitHub에 푸시

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Vercel에 배포

1. [Vercel](https://vercel.com)에 로그인
2. "New Project" 클릭
3. GitHub 저장소 선택 (`dainheo/memoapp`)
4. 환경 변수 설정:
   - `DATABASE_URL`: Vercel의 경우 SQLite 대신 PostgreSQL을 사용하는 것이 좋습니다. [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)를 사용하거나 다른 데이터베이스 서비스를 연결하세요.
   - `NEXTAUTH_URL`: 배포된 도메인 (예: `https://your-app.vercel.app`)
   - `NEXTAUTH_SECRET`: 강력한 랜덤 문자열 생성 (터미널에서 `openssl rand -base64 32` 실행)
5. "Deploy" 클릭

### 3. 데이터베이스 설정 (Vercel)

Vercel에서는 SQLite를 직접 사용할 수 없으므로, 다음 중 하나를 선택하세요:

**옵션 1: Vercel Postgres 사용 (권장)**
1. Vercel 대시보드에서 "Storage" 탭으로 이동
2. "Create Database" → "Postgres" 선택
3. 생성된 연결 문자열을 `DATABASE_URL`에 설정
4. `prisma/schema.prisma`에서 `provider = "postgresql"`로 변경
5. `npx prisma db push` 실행

**옵션 2: 다른 데이터베이스 서비스 사용**
- [PlanetScale](https://planetscale.com) (MySQL)
- [Supabase](https://supabase.com) (PostgreSQL)
- [Railway](https://railway.app) (PostgreSQL)

## 프로젝트 구조

```
memoapp/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── auth/         # 인증 API
│   │   └── notes/         # 메모 API
│   ├── auth/              # 인증 페이지
│   └── page.tsx           # 메인 페이지
├── components/            # React 컴포넌트
│   ├── auth/             # 인증 컴포넌트
│   ├── note-editor.tsx   # 메모 에디터
│   ├── note-list.tsx     # 메모 목록
│   └── sidebar.tsx       # 사이드바
├── lib/                   # 유틸리티
│   └── prisma.ts         # Prisma 클라이언트
├── prisma/               # Prisma 설정
│   └── schema.prisma     # 데이터베이스 스키마
└── types/                # TypeScript 타입 정의
```

## 라이선스

MIT

## 작성자

[dainheo](https://github.com/dainheo)
