"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

  // Calculate default start date (day after current end date)
  const calculateDefaultStartDate = () => {
    const endDate = new Date(currentEndDate)
    const nextDay = new Date(endDate)
    nextDay.setDate(endDate.getDate() + 1)
    return nextDay.toISOString().split("T")[0]
  }

  // Reset form when dialog opens
  const handleOpenChange = (newOpen: boolean) => {
    if (newOpen) {
      setRenewalType("continue")
      setStartDate(calculateDefaultStartDate())
      setTerm("1 year")
    }
    setOpen(newOpen)
  }

  const handleSubmit = () => {
    setProcessing(true)

    // Determine the actual start date based on renewal type
    const effectiveStartDate = renewalType === "continue" ? calculateDefaultStartDate() : startDate

    // In a real app, this would be an API call to renew the agreement
    setTimeout(() => {
      if (onRenew) {
        onRenew(agreementId, effectiveStartDate, term)
      }
      setProcessing(false)
      setOpen(false)
    }, 1000)
  }

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
