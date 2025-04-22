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
  practice_name: "",
    dba: "",
    code: "",
    client_status: "",
    sla_number: "",
    primary_contact_title: "",
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    email: "",
    admin_contact_first_name: "",
    admin_contact_last_name: "",
    admin_contact_phone: "",
    admin_contact_title: "",
    admin_contact_email: "",
    authorized_rep_first_name: "",
    authorized_rep_last_name: "",
    authorized_rep_phone: "",
    authorized_rep_title: "",
    authorized_rep_email: "",
    city: "",
    state: "",
    state_of_formation: "",
    category_id: "",
    street_address: "",
    current_ehr: "",
    type_of_entity: "",
    website: "",
    zip: ""
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
    dba: "",
    code: "",
    client_status: "",
    sla_number: "",
    primary_contact_title: "",
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    email: "",
    admin_contact_first_name: "",
    admin_contact_last_name: "",
    admin_contact_phone: "",
    admin_contact_title: "",
    admin_contact_email: "",
    authorized_rep_first_name: "",
    authorized_rep_last_name: "",
    authorized_rep_phone: "",
    authorized_rep_title: "",
    authorized_rep_email: "",
    city: "",
    state: "",
    state_of_formation: "",
    category_id: "",
    street_address: "",
    current_ehr: "",
    type_of_entity: "",
    website: "",
    zip: ""
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
        zip: Number(formData.zip || 0),
        created_at: new Date().toISOString(),
        client_status: "active"
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
          dba: "",
          code: "",
          client_status: "",
          sla_number: "",
          primary_contact_title: "",
          primary_contact_first_name: "",
          primary_contact_last_name: "",
          primary_contact_email: "",
          primary_contact_phone: "",
          email: "",
          admin_contact_first_name: "",
          admin_contact_last_name: "",
          admin_contact_phone: "",
          admin_contact_title: "",
          admin_contact_email: "",
          authorized_rep_first_name: "",
          authorized_rep_last_name: "",
          authorized_rep_phone: "",
          authorized_rep_title: "",
          authorized_rep_email: "",
          city: "",
          state: "",
          state_of_formation: "",
          street_address: "",
          current_ehr: "",
          category_id: "",
          type_of_entity: "",
          website: "",
          zip: ""
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

            {/* <div className="space-y-2">
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
            </div> */}

            <div className="space-y-2">
              <Label htmlFor="primary_contact_first_name">Primary Contact First Name *</Label>
              <Input
                id="primary_contact_first_name"
                value={formData.primary_contact_first_name}
                onChange={(e) => handleChange("primary_contact_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_last_name">Primary Contact Last Name *</Label>
              <Input
                id="primary_contact_last_name"
                value={formData.primary_contact_last_name}
                onChange={(e) => handleChange("primary_contact_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_title">Primary Contact Title *</Label>
              <Input
                id="primary_contact_title"
                value={formData.primary_contact_title}
                onChange={(e) => handleChange("primary_contact_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_email">Primary Contact Email *</Label>
              <Input
                id="primary_contact_email"
                value={formData.primary_contact_email}
                onChange={(e) => handleChange("primary_contact_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_phone">Primary Contact Phone *</Label>
              <Input
                id="primary_contact_phone"
                value={formData.primary_contact_phone}
                onChange={(e) => handleChange("primary_contact_phone", e.target.value)}
                required
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="admin_contact_first_name">Admin Contact First Name *</Label>
              <Input
                id="admin_contact_first_name"
                value={formData.admin_contact_first_name}
                onChange={(e) => handleChange("admin_contact_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_last_name">Admin Contact Last Name *</Label>
              <Input
                id="admin_contact_last_name"
                value={formData.admin_contact_last_name}
                onChange={(e) => handleChange("admin_contact_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_title">Admin Contact Title *</Label>
              <Input
                id="admin_contact_title"
                value={formData.admin_contact_title}
                onChange={(e) => handleChange("admin_contact_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_email">Admin Contact Email *</Label>
              <Input
                id="admin_contact_email"
                value={formData.admin_contact_email}
                onChange={(e) => handleChange("admin_contact_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_phone">Admin Contact Phone *</Label>
              <Input
                id="admin_contact_phone"
                value={formData.admin_contact_phone}
                onChange={(e) => handleChange("admin_contact_phone", e.target.value)}
                required
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="authorized_rep_first_name">Authorized Contact First Name *</Label>
              <Input
                id="authorized_rep_first_name"
                value={formData.authorized_rep_first_name}
                onChange={(e) => handleChange("authorized_rep_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_last_name">Authorized Contact Last Name *</Label>
              <Input
                id="authorized_rep_last_name"
                value={formData.authorized_rep_last_name}
                onChange={(e) => handleChange("authorized_rep_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_title">Authorized Contact Title *</Label>
              <Input
                id="authorized_rep_title"
                value={formData.authorized_rep_title}
                onChange={(e) => handleChange("authorized_rep_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_email">Authorized Contact Email *</Label>
              <Input
                id="authorized_rep_email"
                value={formData.authorized_rep_email}
                onChange={(e) => handleChange("authorized_rep_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_phone">Authorized Contact Phone *</Label>
              <Input
                id="authorized_rep_phone"
                value={formData.authorized_rep_phone}
                onChange={(e) => handleChange("authorized_rep_phone", e.target.value)}
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
              <Label htmlFor="dba">DBA</Label>
              <Input
                id="dba"
                value={formData.dba}
                onChange={(e) => handleChange("dba", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category ID</Label>
              <Input
                id="category_id"
                value={formData.category_id}
                onChange={(e) => handleChange("category_id", e.target.value)}
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
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_ehr">Current EHR</Label>
                <Input id="current_ehr" value={formData.current_ehr} onChange={(e) => handleChange("current_ehr", e.target.value)} />
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
                <Label htmlFor="state_of_formation">State of Formation *</Label>
                <Select value={formData.state_of_formation} onValueChange={(value) => handleChange("state_of_formation", value)}>
                  <SelectTrigger id="state_of_formation">
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state_of_formation) => (
                      <SelectItem key={state_of_formation} value={state_of_formation}>
                        {state_of_formation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="zip">Zip Code</Label>
              <Input id="zip" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={formData.code} onChange={(e) => handleChange("code", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="client_status">Status</Label>
              <Input id="client_status" value={formData.client_status} onChange={(e) => handleChange("client_status", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="sla_number">SLA Number</Label>
              <Input id="sla_number" value={formData.sla_number} onChange={(e) => handleChange("sla_number", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type_of_entity">Type of Entity</Label>
              <Input id="type_of_entity" value={formData.type_of_entity} onChange={(e) => handleChange("type_of_entity", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
            </div>


          </div>

          {/* Billing Information
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
            </div> */}

            <Separator />

            {/* <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleChange("notes", e.target.value)}
                rows={4}
              />
            </div>
          </div>
        </div> */}

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
