"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase } from "@/lib/supabaseClient" // Import Supabase client
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useSearchParams, useRouter } from "next/navigation"

// Import CSS for the login page
import "./login.css" // Ensure the path is correct for your project structure

export default function LoginPage() {
  const [rememberMe, setRememberMe] = useState(false)
  const [email, setEmail] = useState("")
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
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message || "Invalid credentials")
      } else {
        // On successful login, we store the session
        localStorage.setItem("session", JSON.stringify(data.session)) // Store the session

        // Clear the form
        setEmail("")
        setPassword("")
        setError("") // Clear error messages

        // Redirect to the page stored in 'redirect' or fallback to home
        router.push(redirect)
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      {/* <div className="top-right">
        POWERED BY <span className="hubone">HUBONE SYSTEMS</span>
      </div> */}
      {/* Displaying the Mysage logo */}
      <div className="logo-wrapper">
  <img src="/images/sage_healthy_rcm_logo.png" alt="mySAGE Logo" className="mysage-logo" />
</div>


      <div className="login-box">
      <img src="/images/accountshub.png" alt="AccountsHub" className="login-logo-img" />
        <form onSubmit={handleSubmit} style={{ width: "100%" }}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="error-message">{error}</p>}
          <button type="submit" className="login-btn">
            {isLoading ? "Logging in..." : "LOG IN"}
          </button>
        </form>
      </div>
      <div className="powered-by-text">
    POWERED BY
    HUBONE SYSTEMS
  </div>

       {/* ✅ Footer */}
    <p className="footer-text">
      © 2014–2025 HubOne Systems Inc. – All Rights Reserved
    </p>
    </div>
  )
}
