# 로컬 vs 배포 환경 차이점

## 왜 로컬에서는 되는데 배포하면 안 될까?

로컬과 Vercel 배포 환경은 **완전히 다른 환경**입니다. 주요 차이점을 이해하면 문제를 쉽게 해결할 수 있습니다.

## 🔍 주요 차이점

### 1. 환경 변수 (Environment Variables)

#### 로컬 환경
- ✅ `.env` 파일에 환경 변수가 저장되어 있음
- ✅ 자동으로 로드됨
- ✅ 파일이 Git에 커밋되지 않음 (`.gitignore`에 포함)

```env
# 로컬 .env 파일
DATABASE_URL="file:./prisma/dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
```

#### Vercel 배포 환경
- ❌ `.env` 파일이 없음 (Git에 커밋되지 않음)
- ❌ **수동으로 환경 변수를 설정해야 함**
- ❌ Vercel 대시보드에서 직접 추가해야 함

**해결 방법:**
Vercel 대시보드 → Settings → Environment Variables에서 수동으로 추가

---

### 2. 데이터베이스 (Database)

#### 로컬 환경
- ✅ SQLite 사용 (파일 기반)
- ✅ `prisma/dev.db` 파일에 데이터 저장
- ✅ 파일 시스템에 읽기/쓰기 가능

```prisma
// 로컬에서는 SQLite 사용 가능
datasource db {
  provider = "sqlite"  // 로컬에서는 이렇게 설정
  url      = "file:./prisma/dev.db"
}
```

#### Vercel 배포 환경
- ❌ SQLite 사용 불가능
- ❌ Vercel의 파일 시스템은 **읽기 전용**
- ❌ 파일에 데이터를 저장할 수 없음
- ✅ PostgreSQL 같은 서버 데이터베이스 필요

**해결 방법:**
1. Vercel Postgres 생성
2. `prisma/schema.prisma`를 PostgreSQL로 변경 (이미 완료됨)
3. `DATABASE_URL` 환경 변수에 PostgreSQL 연결 문자열 설정

---

### 3. URL 및 도메인

#### 로컬 환경
- ✅ `http://localhost:3000` (고정)
- ✅ 개발용 URL

#### Vercel 배포 환경
- ✅ `https://memoapp-five.vercel.app` (실제 도메인)
- ✅ HTTPS 필수
- ✅ `NEXTAUTH_URL`에 실제 도메인 설정 필요

---

### 4. 빌드 환경

#### 로컬 환경
- ✅ 개발 모드 (`npm run dev`)
- ✅ 핫 리로드 지원
- ✅ 상세한 에러 메시지

#### Vercel 배포 환경
- ✅ 프로덕션 모드 (`npm run build`)
- ✅ 최적화된 빌드
- ✅ 에러는 로그에서만 확인 가능

---

## 🚨 배포 시 에러가 나는 이유

### 에러 1: "NEXTAUTH_SECRET is not set"
**원인:** 로컬에는 `.env` 파일이 있지만, Vercel에는 환경 변수가 설정되지 않음

**해결:**
```
Vercel 대시보드 → Settings → Environment Variables
→ NEXTAUTH_SECRET 추가
```

### 에러 2: "DATABASE_URL is not set" 또는 "Database connection failed"
**원인:** 
- 로컬: SQLite 파일 (`file:./prisma/dev.db`)
- Vercel: SQLite 사용 불가, PostgreSQL 필요

**해결:**
1. Vercel Postgres 생성
2. `DATABASE_URL` 환경 변수에 PostgreSQL 연결 문자열 추가

### 에러 3: "Table does not exist"
**원인:** 데이터베이스는 생성되었지만 스키마가 적용되지 않음

**해결:**
```bash
npx prisma migrate deploy
```

---

## ✅ 해결 방법 요약

### 1단계: 환경 변수 설정 (필수!)

Vercel 대시보드 → Settings → Environment Variables

다음 3개를 **모두** 추가:

1. **NEXTAUTH_SECRET**
   - 생성: https://generate-secret.vercel.app/32
   - 값: 랜덤 문자열 (예: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3`)

2. **NEXTAUTH_URL**
   - 값: `https://memoapp-five.vercel.app` (배포된 도메인)

3. **DATABASE_URL**
   - Vercel Postgres 생성 후 연결 문자열 복사
   - 형식: `postgresql://user:password@host:port/database?sslmode=require`

### 2단계: 데이터베이스 생성

1. Vercel 대시보드 → **Storage** 탭
2. **Create Database** → **Postgres** 선택
3. 생성된 연결 문자열을 `DATABASE_URL`에 추가

### 3단계: 데이터베이스 마이그레이션

```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

### 4단계: 재배포

환경 변수를 추가한 후:
- Vercel 대시보드에서 **"Redeploy"** 클릭

---

## 📊 비교표

| 항목 | 로컬 환경 | Vercel 배포 |
|------|----------|------------|
| 환경 변수 | `.env` 파일 | Vercel 대시보드에서 설정 |
| 데이터베이스 | SQLite (파일) | PostgreSQL (서버) |
| URL | `localhost:3000` | `https://memoapp-five.vercel.app` |
| 파일 시스템 | 읽기/쓰기 가능 | 읽기 전용 |
| 빌드 모드 | 개발 모드 | 프로덕션 모드 |

---

## 💡 핵심 정리

**로컬에서는 되는데 배포하면 안 되는 이유:**

1. ❌ **환경 변수가 없음** → Vercel 대시보드에서 추가 필요
2. ❌ **SQLite 사용 불가** → PostgreSQL 필요
3. ❌ **데이터베이스 스키마 미적용** → 마이그레이션 필요

**해결책:**
1. ✅ 환경 변수 3개 설정 (NEXTAUTH_SECRET, NEXTAUTH_URL, DATABASE_URL)
2. ✅ Vercel Postgres 생성
3. ✅ 데이터베이스 마이그레이션 실행
4. ✅ 재배포

이 4가지만 하면 로컬과 동일하게 작동합니다!
