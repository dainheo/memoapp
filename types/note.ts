export type NoteColor = "blue" | "green" | "yellow" | "pink" | "orange"

export interface Note {
  id: string
  title: string
  content: string
  color: NoteColor
  createdAt: Date
  updatedAt: Date
}
