"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { supabase } from "@/lib/supabaseClient"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RefreshCw } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface RenewAgreementDialogProps {
  agreementId: string
  clientName: string
  currentEndDate: string
  trigger?: React.ReactNode
  onRenew?: (agreementId: string, startDate: string, term: string) => void
}

export function RenewAgreementDialog({
  agreementId,
  clientName,
  currentEndDate,
  trigger,
  onRenew,
}: RenewAgreementDialogProps) {
  const [open, setOpen] = useState(false)
  const [renewalType, setRenewalType] = useState("continue")
  const [startDate, setStartDate] = useState("")
  const [term, setTerm] = useState("1 year")
  const [processing, setProcessing] = useState(false)

  const calculateDefaultStartDate = () => {
    // Check if currentEndDate is valid
    if (!currentEndDate || isNaN(new Date(currentEndDate).getTime())) {
      console.error("No valid current end date available. Using today's date as fallback.");
      return new Date().toISOString().split("T")[0];  // Return today's date as a fallback
    }
    
    const endDate = new Date(currentEndDate);
    const nextDay = new Date(endDate);
    nextDay.setDate(endDate.getDate() + 1);
    return nextDay.toISOString().split("T")[0];
  };
  

  useEffect(() => {
    // Reset form when dialog opens
    setStartDate(calculateDefaultStartDate())
    setRenewalType("continue")
    setTerm("1 year")
  }, [open])

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }

  const handleSubmit = async () => {
    setProcessing(true)
  
    const effectiveStartDate = renewalType === "continue"
      ? calculateDefaultStartDate()
      : startDate;
  
    const start = new Date(effectiveStartDate);
    const newEnd = new Date(start);
  
    const termNumber = parseInt(term.split(" ")[0], 10);
    const termUnit = term.includes("year") ? "year" : "month";
  
    if (termUnit === "year") {
      newEnd.setFullYear(newEnd.getFullYear() + termNumber);
    } else {
      newEnd.setMonth(newEnd.getMonth() + termNumber);
    }
  
    try {
      const { error: updateError } = await supabase
        .from("agreements")
        .update({
          agreement_date: effectiveStartDate,
          end_date: newEnd.toISOString(),
          term: term
        })
        .eq("agreement_id", agreementId);
  
      if (updateError) {
        console.error("Renewal failed:", updateError);
        return;
      }
  
      // ✅ Insert into notifications
      await supabase.from("notifications").insert([
        {
          message: `Agreement for ${clientName} renewed until ${newEnd.toLocaleDateString()}`,
          type: "success",
          created_at: new Date().toISOString()
        }
      ]);
  
      // ✅ Insert into history
      await supabase.from("history").insert([
        {
          action: "renew_agreement",
          message: `Agreement ${agreementId} renewed for ${clientName}`,
          created_at: new Date().toISOString()
        }
      ]);
  
      // Optional callback
      if (onRenew) {
        onRenew(agreementId, effectiveStartDate, term);
      }
  
      setOpen(false);
    } catch (err) {
      console.error("Unexpected error during renewal:", err);
    } finally {
      setProcessing(false);
    }
  };
  

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
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
            Renew agreement for {clientName} (Agreement ID: {agreementId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Current End Date</Label>
            <div className="text-sm">{new Date(currentEndDate).toLocaleDateString()}</div>
          </div>

          <div className="space-y-2">
            <Label>Renewal Start Date</Label>
            <RadioGroup value={renewalType} onValueChange={setRenewalType} className="space-y-2">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="continue" id="continue" />
                <Label htmlFor="continue" className="font-normal">
                  Continue from previous end date ({new Date(calculateDefaultStartDate()).toLocaleDateString()})
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="custom" id="custom" />
                <Label htmlFor="custom" className="font-normal">
                  Specify new start date
                </Label>
              </div>
            </RadioGroup>
          </div>

          {renewalType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="startDate">New Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="term">New Term</Label>
            <Select value={term} onValueChange={setTerm}>
              <SelectTrigger id="term">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6 months">6 months</SelectItem>
                <SelectItem value="1 year">1 year</SelectItem>
                <SelectItem value="2 years">2 years</SelectItem>
                <SelectItem value="3 years">3 years</SelectItem>
                <SelectItem value="5 years">5 years</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={processing || (renewalType === "custom" && !startDate)}>
            {processing ? "Processing..." : "Renew Agreement"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
