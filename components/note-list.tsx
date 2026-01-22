"use client"

import { Trash2 } from "lucide-react"
import type { Note } from "@/types/note"

interface NoteListProps {
  notes: Note[]
  selectedNote: Note | null
  onSelectNote: (note: Note) => void
  onDeleteNote: (noteId: string) => void
}

const colorMap = {
  blue: "bg-blue-100 border-blue-200",
  green: "bg-emerald-100 border-emerald-200",
  yellow: "bg-amber-100 border-amber-200",
  pink: "bg-pink-100 border-pink-200",
  orange: "bg-orange-100 border-orange-200",
}

const dotColorMap = {
  blue: "bg-blue-400",
  green: "bg-emerald-400",
  yellow: "bg-amber-400",
  pink: "bg-pink-400",
  orange: "bg-orange-400",
}

export function NoteList({ notes, selectedNote, onSelectNote, onDeleteNote }: NoteListProps) {
  const formatDate = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return "오늘"
    if (days === 1) return "어제"
    if (days < 7) return `${days}일 전`

    return date.toLocaleDateString("ko-KR", {
      month: "short",
      day: "numeric",
    })
  }

  if (notes.length === 0) {
    return (
      <section className="w-80 border-r border-border bg-card/50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
            <span className="text-2xl">📝</span>
          </div>
          <p className="text-muted-foreground">메모가 없습니다</p>
          <p className="text-sm text-muted-foreground mt-1">새 메모를 만들어보세요</p>
        </div>
      </section>
    )
  }

  return (
    <section className="w-80 border-r border-border bg-card/50 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-medium text-muted-foreground mb-3">
          {notes.length}개의 메모
        </h2>
        <div className="space-y-3">
          {notes.map((note) => (
            <article
              key={note.id}
              onClick={() => onSelectNote(note)}
              className={`group p-4 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                colorMap[note.color]
              } ${
                selectedNote?.id === note.id
                  ? "ring-2 ring-primary ring-offset-2"
                  : ""
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${dotColorMap[note.color]}`} />
                  <h3 className="font-semibold text-foreground line-clamp-1">
                    {note.title}
                  </h3>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    onDeleteNote(note.id)
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-all"
                  aria-label="메모 삭제"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {note.content || "내용 없음"}
              </p>
              <time className="text-xs text-muted-foreground">
                {formatDate(note.updatedAt)}
              </time>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
