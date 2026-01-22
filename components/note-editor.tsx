"use client"

import { useState, useEffect } from "react"
import { Pencil, Check, X, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import type { Note, NoteColor } from "@/types/note"

interface NoteEditorProps {
  note: Note | null
  isEditing: boolean
  onEdit: () => void
  onSave: (note: Note) => void
  onCancel: () => void
}

const colors: { value: NoteColor; label: string; className: string }[] = [
  { value: "blue", label: "파랑", className: "bg-blue-400" },
  { value: "green", label: "초록", className: "bg-emerald-400" },
  { value: "yellow", label: "노랑", className: "bg-amber-400" },
  { value: "pink", label: "분홍", className: "bg-pink-400" },
  { value: "orange", label: "주황", className: "bg-orange-400" },
]

export function NoteEditor({ note, isEditing, onEdit, onSave, onCancel }: NoteEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [color, setColor] = useState<NoteColor>("blue")
  const [showColorPicker, setShowColorPicker] = useState(false)

  useEffect(() => {
    if (note) {
      setTitle(note.title)
      setContent(note.content)
      setColor(note.color)
    }
  }, [note])

  const handleSave = () => {
    if (note) {
      onSave({
        ...note,
        title: title || "제목 없음",
        content,
        color,
        updatedAt: new Date(),
      })
    }
  }

  if (!note) {
    return (
      <section className="flex-1 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-secondary flex items-center justify-center">
            <span className="text-4xl">✨</span>
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">
            메모를 선택하세요
          </h2>
          <p className="text-muted-foreground">
            왼쪽에서 메모를 선택하거나 새 메모를 만들어보세요
          </p>
        </div>
      </section>
    )
  }

  return (
    <section className="flex-1 flex flex-col bg-background">
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="relative">
            <button
              onClick={() => isEditing && setShowColorPicker(!showColorPicker)}
              className={`w-4 h-4 rounded-full ${colors.find((c) => c.value === color)?.className} ${
                isEditing ? "cursor-pointer hover:ring-2 hover:ring-offset-2 hover:ring-primary" : ""
              }`}
              aria-label="색상 선택"
              disabled={!isEditing}
            />
            {showColorPicker && isEditing && (
              <div className="absolute top-8 left-0 bg-card p-2 rounded-lg shadow-lg border border-border flex gap-2 z-10">
                {colors.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => {
                      setColor(c.value)
                      setShowColorPicker(false)
                    }}
                    className={`w-6 h-6 rounded-full ${c.className} hover:ring-2 hover:ring-offset-2 hover:ring-primary transition-all ${
                      color === c.value ? "ring-2 ring-offset-2 ring-primary" : ""
                    }`}
                    aria-label={c.label}
                  />
                ))}
              </div>
            )}
          </div>
          <span className="text-sm text-muted-foreground">
            {note.updatedAt.toLocaleDateString("ko-KR", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button variant="ghost" size="sm" onClick={onCancel}>
                <X className="w-4 h-4 mr-1" />
                취소
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Check className="w-4 h-4 mr-1" />
                저장
              </Button>
            </>
          ) : (
            <Button variant="ghost" size="sm" onClick={onEdit}>
              <Pencil className="w-4 h-4 mr-1" />
              편집
            </Button>
          )}
        </div>
      </header>

      <div className="flex-1 p-6 overflow-y-auto">
        {isEditing ? (
          <div className="space-y-4 max-w-3xl mx-auto">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              className="text-2xl font-bold border-none bg-transparent p-0 h-auto focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="내용을 입력하세요..."
              className="min-h-[400px] text-base border-none bg-transparent p-0 resize-none focus-visible:ring-0 placeholder:text-muted-foreground/50"
            />
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl font-bold text-foreground mb-6">{note.title}</h1>
            <div className="prose prose-neutral">
              {note.content ? (
                <p className="whitespace-pre-wrap text-foreground/80 leading-relaxed">
                  {note.content}
                </p>
              ) : (
                <p className="text-muted-foreground italic">내용이 없습니다</p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
