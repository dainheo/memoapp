import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, name } = body

    console.log("회원가입 요청 받음:", { email, hasPassword: !!password, name })

    if (!email || !password) {
      return NextResponse.json(
        { error: "이메일과 비밀번호는 필수입니다." },
        { status: 400 }
      )
    }

    // 이메일 중복 확인
    console.log("이메일 중복 확인 중...")
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })
    console.log("이메일 중복 확인 완료:", !!existingUser)

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 사용 중인 이메일입니다." },
        { status: 400 }
      )
    }

    // 비밀번호 해시화
    console.log("비밀번호 해시화 중...")
    const hashedPassword = await bcrypt.hash(password, 10)
    console.log("비밀번호 해시화 완료")

    // 사용자 생성
    console.log("사용자 생성 중...")
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name: name || null,
      },
    })
    console.log("사용자 생성 완료:", user.id)

    return NextResponse.json(
      {
        message: "회원가입이 완료되었습니다.",
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    )
  } catch (error) {
    console.error("회원가입 오류:", error)
    console.error("에러 스택:", error instanceof Error ? error.stack : "스택 없음")
    console.error("에러 전체:", JSON.stringify(error, Object.getOwnPropertyNames(error)))
    
    const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
    const errorStack = error instanceof Error ? error.stack : undefined
    
    return NextResponse.json(
      { 
        error: `회원가입 중 오류가 발생했습니다: ${errorMessage}`,
        details: process.env.NODE_ENV === "development" ? errorStack : undefined
      },
      { status: 500 }
    )
  }
}
