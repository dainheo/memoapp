# 빠른 해결 가이드 - 500 에러

`/api/auth/error`에서 500 에러가 발생하는 경우, 다음을 **즉시 확인**하세요:

## 🔴 필수 확인 사항 (순서대로)

### 1. Vercel 환경 변수 확인 (가장 중요!)

Vercel 대시보드 → 프로젝트 → Settings → Environment Variables

다음 3개가 **모두** 설정되어 있어야 합니다:

#### ✅ NEXTAUTH_SECRET
- **없으면 반드시 추가하세요!**
- 생성 방법:
  - 온라인: https://generate-secret.vercel.app/32
  - 터미널: `openssl rand -base64 32`
- 예시: `aB3dE5fG7hI9jK1lM3nO5pQ7rS9tU1vW3xY5zA7bC9dE1fG3hI5jK7lM9nO1pQ3`

#### ✅ NEXTAUTH_URL
- 값: `https://memoapp-five.vercel.app` (배포된 도메인)
- 또는 Vercel이 제공하는 자동 URL

#### ✅ DATABASE_URL
- PostgreSQL 연결 문자열
- Vercel Postgres 생성 방법:
  1. Vercel 대시보드 → **Storage** 탭
  2. **Create Database** → **Postgres** 선택
  3. 생성된 연결 문자열 복사
  4. 환경 변수에 `DATABASE_URL`로 추가
- 형식: `postgresql://user:password@host:port/database?sslmode=require`

### 2. 환경 변수 적용 확인

환경 변수를 추가/수정한 후:
- **반드시 "Redeploy" 클릭!**
- 또는 새 커밋 푸시 (자동 재배포)

### 3. Vercel 로그 확인

Vercel 대시보드 → Deployments → 최신 배포 → **Functions** 탭

에러 메시지를 확인하세요:
- `NEXTAUTH_SECRET is not set` → 환경 변수 추가 필요
- `DATABASE_URL is not set` → 데이터베이스 연결 문자열 추가 필요
- `Prisma Client not generated` → 빌드 스크립트 문제
- `Connection refused` → 데이터베이스 연결 문제

### 4. 데이터베이스 마이그레이션

환경 변수를 모두 설정한 후:

```bash
# 로컬에서 실행
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

또는 Vercel 대시보드에서:
1. Storage → Postgres → **Data** 탭
2. 테이블이 생성되었는지 확인
3. 없으면 마이그레이션 필요

## 📋 체크리스트

배포 전 확인:

- [ ] `NEXTAUTH_SECRET` 환경 변수 설정됨 (가장 중요!)
- [ ] `NEXTAUTH_URL` 환경 변수 설정됨 (`https://memoapp-five.vercel.app`)
- [ ] `DATABASE_URL` 환경 변수 설정됨 (PostgreSQL)
- [ ] Vercel Postgres 데이터베이스 생성됨
- [ ] 환경 변수 추가 후 **Redeploy** 실행됨
- [ ] 빌드 로그에 에러 없음
- [ ] Functions 로그 확인 완료

## 🚀 빠른 해결 순서

1. **NEXTAUTH_SECRET 생성 및 추가** (1분)
2. **NEXTAUTH_URL 추가** (30초)
3. **Vercel Postgres 생성 및 DATABASE_URL 추가** (2분)
4. **Redeploy 실행** (2분)
5. **로그 확인** (1분)

**총 소요 시간: 약 7분**

## ❓ 여전히 안 되면?

1. Vercel 대시보드 → Deployments → 최신 배포
2. **Build Logs** 확인
3. **Functions** 로그 확인
4. 에러 메시지를 복사해서 알려주세요
