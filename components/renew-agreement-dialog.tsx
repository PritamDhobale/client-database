"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import { RefreshCw } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog"

interface RenewAgreementDialogProps {
  agreementId: string
  clientId: string // ✅ Add this
  clientName: string
  currentEndDate: string
  trigger?: React.ReactNode
  onRenew?: (agreementId: string, startDate: string, term: string) => void
}


export default function RenewAgreementDialog({
  agreementId,
  clientId, // ✅ Add this line
  clientName,
  currentEndDate,
  trigger,
  onRenew,
}: RenewAgreementDialogProps) {

  const [open, setOpen] = useState(false)
  const [renewalType, setRenewalType] = useState("continue")
  const [startDate, setStartDate] = useState("")
  const [commencementDate, setCommencementDate] = useState("")
  const [term, setTerm] = useState("1 year")
  const [processing, setProcessing] = useState(false)

  const calculateDefaultStartDate = () => {
    if (!currentEndDate || isNaN(new Date(currentEndDate).getTime())) {
      return new Date().toISOString().split("T")[0]
    }
    const end = new Date(currentEndDate)
    end.setDate(end.getDate() + 1)
    return end.toISOString().split("T")[0]
  }

  useEffect(() => {
    if (open) {
      const defaultStart = calculateDefaultStartDate()
      setStartDate(defaultStart)
      setCommencementDate("")
      setRenewalType("continue")
      setTerm("1 year")
    }
  }, [open])

  const handleSubmit = async () => {
    setProcessing(true)
  
    const agreementStartDate =
      renewalType === "continue" ? calculateDefaultStartDate() : startDate
    const start = new Date(agreementStartDate)
    const end = new Date(start)
  
    const termValue = parseInt(term.split(" ")[0])
    if (term.includes("year")) {
      end.setFullYear(start.getFullYear() + termValue)
    } else {
      end.setMonth(start.getMonth() + termValue)
    }
  
    const calculatedEndDate = end.toISOString().split("T")[0]
  
    try {
      // ✅ INSERT instead of UPDATE
      const { error } = await supabase.from("agreements").insert([
        {
          client_id: clientId,
          agreement_date: agreementStartDate,
          commencement_date: commencementDate,
          term: term,
          end_date: calculatedEndDate,
          created_at: new Date().toISOString(),
        },
      ])            
  
      if (error) {
        console.error("Insert failed:", error)
        return
      }
  
      // 🔔 Notification
      await supabase.from("notifications").insert([
        {
          message: `Agreement for ${clientName} renewed.`,
          type: "info",
          created_at: new Date().toISOString(),
        },
      ])
  
      // 🕓 History
      await supabase.from("history_logs").insert([
        {
          action: "renew_agreement",
          message: `New agreement created for client ${clientName} with start ${agreementStartDate} and term ${term}`,
          created_at: new Date().toISOString(),
        },
      ])
  
      if (onRenew) onRenew(agreementId, agreementStartDate, term)
  
      setOpen(false)
    } catch (err) {
      console.error("Unexpected error:", err)
    } finally {
      setProcessing(false)
    }
  }
  
  

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Renew Agreement
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Renew Agreement</DialogTitle>
          <DialogDescription>
            Update agreement for <strong>{clientName}</strong> (ID: {agreementId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div>
            <Label>Current End Date</Label>
            <div className="text-sm">{new Date(currentEndDate).toLocaleDateString()}</div>
          </div>

          <div className="space-y-2">
            <Label>New Start Date</Label>
            <RadioGroup value={renewalType} onValueChange={setRenewalType}>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="continue" id="continue" />
                <Label htmlFor="continue" className="font-normal">
                  Continue from {new Date(calculateDefaultStartDate()).toLocaleDateString()}
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal">Set Custom Start Date</Label>
              </div>
            </RadioGroup>
            {renewalType === "custom" && (
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            )}
          </div>

          <div className="space-y-2">
            <Label>Commencement Date</Label>
            <Input
              type="date"
              value={commencementDate}
              onChange={(e) => setCommencementDate(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Term</Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger><SelectValue placeholder="Select term" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
                <SelectItem value="2 years">2 years</SelectItem>
                <SelectItem value="3 years">3 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={processing || (renewalType === "custom" && !startDate)}>
            {processing ? "Processing..." : "Renew Agreement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
