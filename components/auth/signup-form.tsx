"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function SignUpForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    console.log("회원가입 시도:", { email, hasPassword: !!password, name })

    try {
      // 회원가입
      console.log("회원가입 API 호출 시작...")
      const registerResponse = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      })

      console.log("회원가입 API 응답:", registerResponse.status, registerResponse.statusText)

      let registerData
      try {
        registerData = await registerResponse.json()
      } catch (e) {
        setError("서버 응답을 파싱할 수 없습니다.")
        setLoading(false)
        return
      }

      if (!registerResponse.ok) {
        setError(registerData.error || "회원가입 중 오류가 발생했습니다.")
        setLoading(false)
        return
      }

      // 자동 로그인
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("회원가입은 완료되었지만 로그인에 실패했습니다. 로그인 페이지에서 다시 시도해주세요.")
        setLoading(false)
      } else {
        // 성공적으로 로그인됨 - 페이지 전체 새로고침으로 세션 확실히 반영
        window.location.href = "/"
      }
    } catch (error) {
      console.error("회원가입 에러:", error)
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류"
      setError(`회원가입 중 오류가 발생했습니다: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          이름 (선택)
        </label>
        <Input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="이름을 입력하세요"
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          이메일
        </label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="이메일을 입력하세요"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium mb-1">
          비밀번호
        </label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          placeholder="비밀번호를 입력하세요"
          minLength={6}
        />
      </div>
      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "회원가입 중..." : "회원가입"}
      </Button>
    </form>
  )
}
