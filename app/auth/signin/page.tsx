"use client"

import { useState } from "react"
import Link from "next/link"
import { SignInForm } from "@/components/auth/signin-form"
import { SignUpForm } from "@/components/auth/signup-form"

export default function AuthPage() {
  const [isSignIn, setIsSignIn] = useState(true)

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold">메모 앱</h1>
          <p className="text-muted-foreground mt-2">
            {isSignIn ? "로그인하여 계속하세요" : "새 계정을 만드세요"}
          </p>
        </div>

        <div className="bg-card border rounded-lg p-6 shadow-sm">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsSignIn(true)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                isSignIn
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              로그인
            </button>
            <button
              onClick={() => setIsSignIn(false)}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                !isSignIn
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              회원가입
            </button>
          </div>

          {isSignIn ? <SignInForm /> : <SignUpForm />}
        </div>
      </div>
    </div>
  )
}
