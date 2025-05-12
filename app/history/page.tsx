"use client"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function HistoryPage() {
  const [history, setHistory] = useState<any[]>([])
  const router = useRouter() // ✅ Move this here

  useEffect(() => {
    const fetchHistory = async () => {
      const { data, error } = await supabase
        .from("history_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(100)

      if (!error) setHistory(data)
      else console.error("History fetch error", error)
    }

    fetchHistory()
  }, [])

  return (
    <div className="p-6">
      <Button onClick={() => router.push("/")} className="mb-4">
        ← Back to Dashboard
      </Button>

      <h1 className="text-xl font-bold mb-4">Change History</h1>
      <div className="space-y-4">
        {history.length === 0 ? (
          <p className="text-gray-500">No history logs available.</p>
        ) : (
          history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="text-sm font-medium">
                  {item.action}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">User: {item.user || "Unknown"}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(item.created_at).toLocaleString()}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
