import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const notes = await prisma.note.findMany({
      where: { userId: session.user.id },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json(notes)
  } catch (error) {
    console.error("메모 조회 오류:", error)
    return NextResponse.json(
      { error: "메모를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const body = await request.json()
    const { title, content, color } = body

    if (!title) {
      return NextResponse.json(
        { error: "제목은 필수입니다." },
        { status: 400 }
      )
    }

    const note = await prisma.note.create({
      data: {
        title: title || "새 메모",
        content: content || "",
        color: color || "blue",
        userId: session.user.id,
      },
    })

    return NextResponse.json(note, { status: 201 })
  } catch (error) {
    console.error("메모 생성 오류:", error)
    return NextResponse.json(
      { error: "메모를 생성하는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
