# Vercel 배포 오류 해결 가이드

## 서버 설정 오류 해결 방법

배포 후 "Server error"가 발생하는 경우, 다음을 확인하세요:

### 1. 환경 변수 확인 (필수)

Vercel 대시보드에서 다음 환경 변수가 모두 설정되어 있는지 확인:

#### 필수 환경 변수:

1. **NEXTAUTH_SECRET**
   - 값: 강력한 랜덤 문자열
   - 생성 방법:
     ```bash
     openssl rand -base64 32
     ```
   - 또는 온라인 생성기: https://generate-secret.vercel.app/32
   - **이 변수가 없으면 서버 오류가 발생합니다!**

2. **NEXTAUTH_URL**
   - 값: 배포된 도메인 (예: `https://memoapp-xxx.vercel.app`)
   - Vercel이 자동으로 제공하는 URL 사용
   - 커스텀 도메인을 사용하는 경우 해당 도메인

3. **DATABASE_URL**
   - 값: PostgreSQL 연결 문자열
   - 형식: `postgresql://user:password@host:port/database?sslmode=require`
   - Vercel Postgres를 사용하는 경우:
     1. Vercel 대시보드 → "Storage" 탭
     2. "Create Database" → "Postgres" 선택
     3. 생성된 연결 문자열 복사
     4. 환경 변수에 추가

### 2. Prisma 스키마 확인

`prisma/schema.prisma` 파일이 PostgreSQL로 설정되어 있는지 확인:

```prisma
datasource db {
  provider = "postgresql"  // "sqlite"가 아닌 "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. 데이터베이스 마이그레이션

배포 후 데이터베이스 스키마를 적용해야 합니다:

**방법 1: Vercel CLI 사용 (권장)**
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
npx prisma migrate deploy
```

**방법 2: Vercel 대시보드에서 수동 실행**
1. Vercel 대시보드 → 프로젝트 선택
2. "Deployments" 탭 → 최신 배포 선택
3. "Functions" 로그 확인
4. 필요시 "Redeploy" 실행

### 4. 빌드 로그 확인

Vercel 대시보드에서:
1. "Deployments" 탭 선택
2. 실패한 배포 클릭
3. "Build Logs" 확인
4. 에러 메시지 확인

### 5. 일반적인 오류 및 해결 방법

#### 오류: "NEXTAUTH_SECRET is not set"
- **해결**: Vercel 환경 변수에 `NEXTAUTH_SECRET` 추가

#### 오류: "Database connection failed"
- **해결**: 
  - `DATABASE_URL`이 올바른 PostgreSQL 연결 문자열인지 확인
  - 데이터베이스가 생성되었는지 확인
  - 연결 문자열에 `?sslmode=require`가 포함되어 있는지 확인

#### 오류: "Prisma Client not generated"
- **해결**: 
  - `package.json`의 `build` 스크립트에 `prisma generate`가 포함되어 있는지 확인
  - 또는 `postinstall` 스크립트에 `prisma generate` 추가

#### 오류: "Table does not exist"
- **해결**: 데이터베이스 마이그레이션 실행 (`npx prisma migrate deploy`)

### 6. 재배포

모든 설정을 완료한 후:
1. Vercel 대시보드에서 "Redeploy" 클릭
2. 또는 GitHub에 새로운 커밋 푸시 (자동 재배포)

### 7. 확인 사항 체크리스트

- [ ] `NEXTAUTH_SECRET` 환경 변수 설정됨
- [ ] `NEXTAUTH_URL` 환경 변수 설정됨 (배포된 도메인)
- [ ] `DATABASE_URL` 환경 변수 설정됨 (PostgreSQL)
- [ ] `prisma/schema.prisma`가 `provider = "postgresql"`로 설정됨
- [ ] `package.json`의 `build` 스크립트에 `prisma generate` 포함됨
- [ ] 데이터베이스 마이그레이션 실행됨
- [ ] 빌드 로그에 에러가 없음

### 8. 추가 도움말

문제가 계속되면:
1. Vercel 대시보드의 "Functions" 로그 확인
2. 브라우저 개발자 도구(F12)의 Console 탭 확인
3. Vercel 공식 문서: https://vercel.com/docs
4. NextAuth.js 문서: https://next-auth.js.org
