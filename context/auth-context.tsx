"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient" // Import Supabase client
import type { AuthState, User } from "@/types/auth" // Import types

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
    // Check if user is already authenticated from Supabase session
    const checkUserSession = async () => {
      const { data, error } = await supabase.auth.getSession() // Fix for session

      if (data && data.session?.user) {
        // If user data exists in session, map it to your User type
        const user: User = {
          id: data.session.user.id,
          username: data.session.user.email || "",  // Fallback to empty string if email is undefined
          name: data.session.user.user_metadata?.full_name || "Unknown", // Fallback if full_name is undefined
          role: "user",  // Default role, adjust as per your logic
          email: data.session.user.email || "", // Fallback to empty string if email is undefined
        }        

        setState({
          user,
          isAuthenticated: true,
          isLoading: false,
        })
      } else {
        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        })
      }
    }
    checkUserSession()
  }, [])

  const login = (user: User) => {
    setState({
      user,
      isAuthenticated: true,
      isLoading: false,
    })
    localStorage.setItem("auth_user", JSON.stringify(user)) // Persist user in localStorage
  }

  const logout = async () => {
    await supabase.auth.signOut() // Supabase logout
    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    })
    localStorage.removeItem("auth_user") // Clear localStorage
    router.push("/login") // Redirect to login page after logging out
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
