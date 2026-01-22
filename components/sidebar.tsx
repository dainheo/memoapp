"use client"

import React from "react"
import { signOut, useSession } from "next-auth/react"

import { Search, Plus, FileText, Star, Archive, LogOut } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onCreateNote: () => void
  noteCount: number
}

export function Sidebar({ searchQuery, onSearchChange, onCreateNote, noteCount }: SidebarProps) {
  const { data: session } = useSession()

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/auth/signin" })
  }

  return (
    <aside className="w-64 bg-card border-r border-border flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <FileText className="w-4 h-4 text-primary-foreground" />
          </div>
          <h1 className="text-xl font-semibold text-foreground">Memo</h1>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="메모 검색..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 bg-input border-none"
          />
        </div>
        {session?.user && (
          <div className="mt-3 text-sm text-muted-foreground">
            {session.user.email}
          </div>
        )}
      </div>

      <nav className="flex-1 p-3 space-y-1">
        <NavItem icon={FileText} label="모든 메모" count={noteCount} active />
        <NavItem icon={Star} label="즐겨찾기" count={0} />
        <NavItem icon={Archive} label="보관함" count={0} />
      </nav>

      <div className="p-3 border-t border-border space-y-2">
        <Button onClick={onCreateNote} className="w-full gap-2" size="lg">
          <Plus className="w-4 h-4" />
          새 메모
        </Button>
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full gap-2"
          size="lg"
        >
          <LogOut className="w-4 h-4" />
          로그아웃
        </Button>
      </div>
    </aside>
  )
}

interface NavItemProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  count: number
  active?: boolean
}

function NavItem({ icon: Icon, label, count, active }: NavItemProps) {
  return (
    <button
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
        active
          ? "bg-primary/10 text-primary"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      }`}
    >
      <Icon className="w-4 h-4" />
      <span className="flex-1 text-left text-sm font-medium">{label}</span>
      <span
        className={`text-xs font-medium px-2 py-0.5 rounded-full ${
          active ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  )
}
