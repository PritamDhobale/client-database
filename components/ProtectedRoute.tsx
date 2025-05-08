"use client"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"
import { useAuth } from "@/context/auth-context"

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"]

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !PUBLIC_ROUTES.includes(pathname)) {
      router.push("/login")
    }
  }, [isAuthenticated, isLoading, pathname])

  // Optional loading UI
  if (isLoading) return <div>Loading...</div>

  return <>{children}</>
}
