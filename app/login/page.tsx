"use client"

import type React from "react"
import Image from "next/image"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams, useRouter } from "next/navigation"

export default function LoginPage() {
  const { login: setAuthUser } = useAuth()
  const [rememberMe, setRememberMe] = useState(false)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()
  const redirect = searchParams.get("redirect") || "/"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // For demo purposes, we'll use the mock users directly
      // In a real app, this would be an API call
      if (
        (username === "admin" && password === "admin123") ||
        (username === "user" && password === "user123") ||
        // Add the new test credentials
        (username === "test@sagehealthy.com" && password === "12345678")
      ) {
        // Determine user details based on username
        let userId = "3" // Default for new test user
        let userName = "Test User"
        let userRole = "user"

        if (username === "admin") {
          userId = "1"
          userName = "Admin User"
          userRole = "admin"
        } else if (username === "user") {
          userId = "2"
          userName = "Regular User"
        }

        // Simulate successful login
        const mockUser = {
          id: userId,
          username,
          name: userName,
          role: userRole as "admin" | "user",
          email: username.includes("@") ? username : `${username}@sagehealthy.com`,
        }

        // Update auth context
        setAuthUser(mockUser)

        // Redirect to dashboard or requested page
        router.push(redirect)
      } else {
        setError("Invalid username or password")
      }
    } catch (err) {
      setError("An error occurred during login")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="w-24 h-24 relative">
              <Image
                src="/images/sage_healthy_rcm_logo.png"
                alt="Sage Healthy Logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Sage Healthy</CardTitle>
          <CardDescription>RCM Admin Portal</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username / Email</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username or email"
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a href="#" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </a>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(checked) => setRememberMe(!!checked)} />
              <Label htmlFor="remember">Remember me</Label>
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </Button>
          </form>

          {/* Add test credentials hint for development */}
          <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
            <p className="text-xs text-gray-500 font-medium">Test Credentials:</p>
            <ul className="text-xs text-gray-500 mt-1 space-y-1">
              <li>Email: test@sagehealthy.com</li>
              <li>Password: 12345678</li>
            </ul>
          </div>
        </CardContent>
        <CardFooter className="text-center text-sm text-gray-500">
          &copy; {new Date().getFullYear()} Sage Healthy. All rights reserved.
        </CardFooter>
      </Card>
    </div>
  )
}
