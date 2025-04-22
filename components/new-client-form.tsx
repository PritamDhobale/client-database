"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
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

interface Client {
  client_id: number
  practice_name: string
  primary_contact: string
  email: string
  phone: string
  state: string
  category: string
  created_at: string
  tax_id: string
  npi: string
  notes: string
  street_address: string
  zip_code: string
  city: string
  billing_contact_name: string
  billing_contact_email: string
  billing_contact_phone: string
  status: string
  }

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
    practice_name: "",
    category: "",
    primary_contact: "",
    email: "",
    phone: "",
    state: "",
    street_address: "",
    city: "",
    zip_code: "",
    tax_id: "",
    npi: "",
    billing_contact_name: "",
    billing_contact_email: "",
    billing_contact_phone: "",
    notes: "",
  })
  

  const handleChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  const handleSubmit = async () => {
    setSaving(true)
    try {
      const payload = {
        ...formData,
        zip_code: Number(formData.zip_code || 0),
        tax_id: Number(formData.tax_id || 0),
        created_at: new Date().toISOString(),
        status: "active"
      }
  
      console.log("Payload being sent:", payload)
  
      const { data, error } = await supabase
        .from("Clients")
        .insert([payload])
        .select("*")
  
      if (error) {
        console.error("❌ Failed to add client:", error)
      } else {
        console.log("✅ Client added:", data)
        setOpen(false)
        // Reset formData to blank values
        setFormData({
          practice_name: "",
          category: "",
          primary_contact: "",
          email: "",
          phone: "",
          state: "",
          street_address: "",
          city: "",
          zip_code: "",
          tax_id: "",
          npi: "",
          billing_contact_name: "",
          billing_contact_email: "",
          billing_contact_phone: "",
          notes: ""
        })
      }
    } catch (err) {
      console.error("Unexpected error while adding client:", err)
    } finally {
      setSaving(false)
    }
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
              <Label htmlFor="practice_name">Practice Name *</Label>
              <Input
                id="practice_name"
                value={formData.practice_name}
                onChange={(e) => handleChange("practice_name", e.target.value)}
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
              <Label htmlFor="primary_contact">Primary Contact *</Label>
              <Input
                id="primary_contact"
                value={formData.primary_contact}
                onChange={(e) => handleChange("primary_contact", e.target.value)}
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
              <Input id="street" value={formData.street_address} onChange={(e) => handleChange("street_address", e.target.value)} />
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
              <Label htmlFor="zip_code">Zip Code</Label>
              <Input id="zip_code" value={formData.zip_code} onChange={(e) => handleChange("zip_code", e.target.value)} />
            </div>
          </div>

          {/* Billing Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Billing Information</h3>

            <div className="space-y-2">
              <Label htmlFor="tax_id">Tax ID</Label>
              <Input id="tax_id" value={formData.tax_id} onChange={(e) => handleChange("tax_id", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" value={formData.npi} onChange={(e) => handleChange("npi", e.target.value)} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="billing_contact_name">Billing Contact Name</Label>
              <Input
                id="billing_contact_name"
                value={formData.billing_contact_name}
                onChange={(e) => handleChange("billing_contact_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_contact_email">Billing Contact Email</Label>
              <Input
                id="billing_contact_email"
                type="email"
                value={formData.billing_contact_email}
                onChange={(e) => handleChange("billing_contact_email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_contact_phone">Billing Contact Phone</Label>
              <Input
                id="billing_contact_phone"
                value={formData.billing_contact_phone}
                onChange={(e) => handleChange("billing_contact_phone", e.target.value)}
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
