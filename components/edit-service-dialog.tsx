"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { FileEdit } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

interface ServiceDetails {
  id: string
  clientId: string
  clientName: string
  serviceName: string
  rate: string
  minimumCharge: string
  nppStatus: boolean
  notes: string
}

interface EditServiceDialogProps {
  service: ServiceDetails
  trigger?: React.ReactNode
  onSave?: (service: ServiceDetails) => void
}

export function EditServiceDialog({ service, trigger, onSave }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<ServiceDetails>({ ...service })
  const [saving, setSaving] = useState(false)

  const handleChange = (field: keyof ServiceDetails, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSubmit = () => {
    setSaving(true)

    // In a real app, this would be an API call to update the service
    setTimeout(() => {
      if (onSave) {
        onSave(formData)
      }
      setSaving(false)
      setOpen(false)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm">
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update service details for {service.clientName} (Client ID: {service.clientId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              value={formData.serviceName}
              onChange={(e) => handleChange("serviceName", e.target.value)}
              disabled
            />
            <p className="text-xs text-gray-500">Service name cannot be changed. Create a new service instead.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Rate</Label>
            <Input
              id="rate"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
              placeholder="e.g., $25 per claim, 8% of collections"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimumCharge">Minimum Charge</Label>
            <Input
              id="minimumCharge"
              value={formData.minimumCharge}
              onChange={(e) => handleChange("minimumCharge", e.target.value)}
              placeholder="e.g., $500 per month, N/A"
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="nppStatus" className="cursor-pointer">
              NPP Status
            </Label>
            <Switch
              id="nppStatus"
              checked={formData.nppStatus}
              onCheckedChange={(checked) => handleChange("nppStatus", checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional information about this service"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
