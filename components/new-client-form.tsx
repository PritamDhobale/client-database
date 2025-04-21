"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

// List of US states for the dropdown
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

// List of categories
const CATEGORIES = ["Primary Care", "Specialty", "Hospital", "Other"]

export function NewClientForm() {
  const [open, setOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    practiceName: "",
    category: "",
    primaryContact: "",
    email: "",
    phone: "",
    state: "",
    street: "",
    city: "",
    zipCode: "",
    taxId: "",
    npi: "",
    billingContactName: "",
    billingContactEmail: "",
    billingContactPhone: "",
    notes: "",
  })

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = () => {
    setSaving(true)

    // In a real app, this would be an API call to create the client
    setTimeout(() => {
      setSaving(false)
      setOpen(false)
      // Reset form
      setFormData({
        practiceName: "",
        category: "",
        primaryContact: "",
        email: "",
        phone: "",
        state: "",
        street: "",
        city: "",
        zipCode: "",
        taxId: "",
        npi: "",
        billingContactName: "",
        billingContactEmail: "",
        billingContactPhone: "",
        notes: "",
      })
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Enter the client details below to create a new client record.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="practiceName">Practice Name *</Label>
              <Input
                id="practiceName"
                value={formData.practiceName}
                onChange={(e) => handleChange("practiceName", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primaryContact">Primary Contact *</Label>
              <Input
                id="primaryContact"
                value={formData.primaryContact}
                onChange={(e) => handleChange("primaryContact", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                required
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" value={formData.street} onChange={(e) => handleChange("street", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                  <SelectTrigger id="state">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input id="zipCode" value={formData.zipCode} onChange={(e) => handleChange("zipCode", e.target.value)} />
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Information</h3>

            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" value={formData.taxId} onChange={(e) => handleChange("taxId", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" value={formData.npi} onChange={(e) => handleChange("npi", e.target.value)} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="billingContactName">Billing Contact Name</Label>
              <Input
                id="billingContactName"
                value={formData.billingContactName}
                onChange={(e) => handleChange("billingContactName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingContactEmail">Billing Contact Email</Label>
              <Input
                id="billingContactEmail"
                type="email"
                value={formData.billingContactEmail}
                onChange={(e) => handleChange("billingContactEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingContactPhone">Billing Contact Phone</Label>
              <Input
                id="billingContactPhone"
                value={formData.billingContactPhone}
                onChange={(e) => handleChange("billingContactPhone", e.target.value)}
              />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Creating..." : "Create Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
