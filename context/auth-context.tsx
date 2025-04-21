"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { AuthState, User } from "@/types/auth"

interface AuthContextType extends AuthState {
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  })

  const router = useRouter()

  useEffect(() => {
    // Check if user is already authenticated
    // For demo purposes, we'll check localStorage
    // In a real app, this would be an API call to check the session
    const storedUser = localStorage.getItem("auth_user")

    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } catch (error) {
        console.error("Failed to parse stored user:", error)
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
        localStorage.removeItem("auth_user")
      }
    } else {
      setState({
        user: null,
        isAuthenticated: false,
        isLoading: false,
      })
    }
  }, [])

  const login = (user: User) => {
    // Store user in localStorage for persistence
    localStorage.setItem("auth_user", JSON.stringify(user))

    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
  }

  const logout = () => {
    // Clear stored user
    localStorage.removeItem("auth_user")

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })

    router.push("/login")
  }

  return <AuthContext.Provider value={{ ...state, login, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
