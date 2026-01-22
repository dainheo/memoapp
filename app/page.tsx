"use client"

import { useState, useEffect, useCallback } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { NoteList } from "@/components/note-list"
import { NoteEditor } from "@/components/note-editor"
import { Sidebar } from "@/components/sidebar"
import type { Note } from "@/types/note"

export default function MemoApp() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [notes, setNotes] = useState<Note[]>([])
  const [selectedNote, setSelectedNote] = useState<Note | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)

  const loadNotes = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/notes")
      if (response.ok) {
        const data = await response.json()
        setNotes(data.map((note: any) => ({
          ...note,
          createdAt: new Date(note.createdAt),
          updatedAt: new Date(note.updatedAt),
        })))
      } else {
        console.error("메모 로드 실패:", response.status, response.statusText)
      }
    } catch (error) {
      console.error("메모 로드 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin")
      return
    }
    
    if (status === "authenticated" && session?.user?.id) {
      loadNotes()
    } else if (status === "authenticated") {
      setLoading(false)
    }
  }, [status, session?.user?.id, loadNotes, router])

  const handleCreateNote = async () => {
    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: "새 메모",
          content: "",
          color: "blue",
        }),
      })

      if (response.ok) {
        const newNote = await response.json()
        const note: Note = {
          ...newNote,
          createdAt: new Date(newNote.createdAt),
          updatedAt: new Date(newNote.updatedAt),
        }
        setNotes([note, ...notes])
        setSelectedNote(note)
        setIsEditing(true)
      }
    } catch (error) {
      console.error("메모 생성 오류:", error)
    }
  }

  const handleUpdateNote = async (updatedNote: Note) => {
    try {
      const response = await fetch(`/api/notes/${updatedNote.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: updatedNote.title,
          content: updatedNote.content,
          color: updatedNote.color,
        }),
      })

      if (response.ok) {
        const savedNote = await response.json()
        const note: Note = {
          ...savedNote,
          createdAt: new Date(savedNote.createdAt),
          updatedAt: new Date(savedNote.updatedAt),
        }
        setNotes(notes.map((n) => (n.id === note.id ? note : n)))
        setSelectedNote(note)
      }
    } catch (error) {
      console.error("메모 업데이트 오류:", error)
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setNotes(notes.filter((note) => note.id !== noteId))
        if (selectedNote?.id === noteId) {
          setSelectedNote(null)
          setIsEditing(false)
        }
      }
    } catch (error) {
      console.error("메모 삭제 오류:", error)
    }
  }

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note)
    setIsEditing(false)
  }

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">세션 확인 중...</div>
      </div>
    )
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">로그인 페이지로 이동 중...</div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-muted-foreground">메모를 불러오는 중...</div>
      </div>
    )
  }

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <main className="flex h-screen bg-background">
      <Sidebar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onCreateNote={handleCreateNote}
        noteCount={notes.length}
      />
      <NoteList
        notes={filteredNotes}
        selectedNote={selectedNote}
        onSelectNote={handleSelectNote}
        onDeleteNote={handleDeleteNote}
      />
      <NoteEditor
        note={selectedNote}
        isEditing={isEditing}
        onEdit={() => setIsEditing(true)}
        onSave={handleUpdateNote}
        onCancel={() => setIsEditing(false)}
      />
    </main>
  )
}
