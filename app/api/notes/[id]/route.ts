import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../auth/[...nextauth]/route"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = await params
    const note = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!note) {
      return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 })
    }

    return NextResponse.json(note)
  } catch (error) {
    console.error("메모 조회 오류:", error)
    return NextResponse.json(
      { error: "메모를 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const { title, content, color } = body

    // 메모 소유권 확인
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 })
    }

    const note = await prisma.note.update({
      where: { id },
      data: {
        title,
        content,
        color,
      },
    })

    return NextResponse.json(note)
  } catch (error) {
    console.error("메모 업데이트 오류:", error)
    return NextResponse.json(
      { error: "메모를 업데이트하는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: "인증이 필요합니다." }, { status: 401 })
    }

    const { id } = await params
    // 메모 소유권 확인
    const existingNote = await prisma.note.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    })

    if (!existingNote) {
      return NextResponse.json({ error: "메모를 찾을 수 없습니다." }, { status: 404 })
    }

    await prisma.note.delete({
      where: { id },
    })

    return NextResponse.json({ message: "메모가 삭제되었습니다." })
  } catch (error) {
    console.error("메모 삭제 오류:", error)
    return NextResponse.json(
      { error: "메모를 삭제하는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}
