"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { PlusCircle } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock clients for dropdown
const clients = [
  { id: "CL001", name: "Sunshine Medical Group" },
  { id: "CL002", name: "Westside Healthcare" },
  { id: "CL003", name: "Northpark Physicians" },
  { id: "CL005", name: "Valley Health Partners" },
  { id: "CL007", name: "Coastal Care Clinic" },
]

// Common service types for dropdown
const serviceTypes = [
  "Medical Billing",
  "Coding Review",
  "Credentialing",
  "AR Management",
  "Denial Management",
  "Practice Management",
  "Consulting",
  "Custom Service",
]

interface NewServiceDialogProps {
  trigger?: React.ReactNode
  onAdd?: (service: any) => void
}

export function NewServiceDialog({ trigger, onAdd }: NewServiceDialogProps) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    clientId: "",
    serviceName: "",
    rate: "",
    minimumCharge: "",
    nppStatus: true,
    notes: "",
    customServiceName: "",
  })
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.clientId) {
      newErrors.clientId = "Client is required"
    }

    if (!formData.serviceName) {
      newErrors.serviceName = "Service type is required"
    }

    if (formData.serviceName === "Custom Service" && !formData.customServiceName) {
      newErrors.customServiceName = "Custom service name is required"
    }

    if (!formData.rate) {
      newErrors.rate = "Rate is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = () => {
    if (!validateForm()) {
      return
    }

    setSaving(true)

    // Prepare the service data
    const serviceData = {
      id: `SV${Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, "0")}`,
      clientId: formData.clientId,
      clientName: clients.find((c) => c.id === formData.clientId)?.name || "",
      serviceName: formData.serviceName === "Custom Service" ? formData.customServiceName : formData.serviceName,
      rate: formData.rate,
      minimumCharge: formData.minimumCharge || "N/A",
      nppStatus: formData.nppStatus,
      notes: formData.notes,
    }

    // In a real app, this would be an API call to create the service
    setTimeout(() => {
      if (onAdd) {
        onAdd(serviceData)
      }
      setSaving(false)
      setOpen(false)
      // Reset form
      setFormData({
        clientId: "",
        serviceName: "",
        rate: "",
        minimumCharge: "",
        nppStatus: true,
        notes: "",
        customServiceName: "",
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Service</DialogTitle>
          <DialogDescription>Create a new service for a client.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="clientId">Client *</Label>
            <Select value={formData.clientId} onValueChange={(value) => handleChange("clientId", value)}>
              <SelectTrigger id="clientId" className={errors.clientId ? "border-red-500" : ""}>
                <SelectValue placeholder="Select client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} ({client.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.clientId && <p className="text-xs text-red-500">{errors.clientId}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="serviceName">Service Type *</Label>
            <Select value={formData.serviceName} onValueChange={(value) => handleChange("serviceName", value)}>
              <SelectTrigger id="serviceName" className={errors.serviceName ? "border-red-500" : ""}>
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceTypes.map((service) => (
                  <SelectItem key={service} value={service}>
                    {service}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.serviceName && <p className="text-xs text-red-500">{errors.serviceName}</p>}
          </div>

          {formData.serviceName === "Custom Service" && (
            <div className="space-y-2">
              <Label htmlFor="customServiceName">Custom Service Name *</Label>
              <Input
                id="customServiceName"
                value={formData.customServiceName}
                onChange={(e) => handleChange("customServiceName", e.target.value)}
                placeholder="Enter custom service name"
                className={errors.customServiceName ? "border-red-500" : ""}
              />
              {errors.customServiceName && <p className="text-xs text-red-500">{errors.customServiceName}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="rate">Rate *</Label>
            <Input
              id="rate"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
              placeholder="e.g., $25 per claim, 8% of collections"
              className={errors.rate ? "border-red-500" : ""}
            />
            {errors.rate && <p className="text-xs text-red-500">{errors.rate}</p>}
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
            {saving ? "Creating..." : "Create Service"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
