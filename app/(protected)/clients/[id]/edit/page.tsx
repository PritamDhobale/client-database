"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getClientById, type Client } from "@/data/clients"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"

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

export default function ClientEditPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    // In a real app, this would be an API call
    const fetchedClient = getClientById(params.id)
    if (fetchedClient) {
      setClient(fetchedClient)
    }
    setLoading(false)
  }, [params.id])

  const handleChange = (field: string, value: string) => {
    if (!client) return

    if (field.includes(".")) {
      const [parent, child] = field.split(".")
      setClient({
        ...client,
        [parent]: {
          ...client[parent as keyof Client],
          [child]: value,
        },
      })
    } else {
      setClient({
        ...client,
        [field]: value,
      })
    }
  }

  const handleSave = () => {
    setSaving(true)

    // In a real app, this would be an API call to update the client
    setTimeout(() => {
      setSaving(false)
      router.push(`/clients/${params.id}`)
    }, 1000)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading client details...</p>
        </div>
      </div>
    )
  }

  if (!client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Client Not Found</h1>
        </div>
        <p>The client you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.push("/clients")}>Return to Clients</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header with back button and actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Edit Client</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/clients/${client.id}`)}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
            <CardDescription>Client profile and contact details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="practiceName">Practice Name</Label>
              <Input
                id="practiceName"
                value={client.practiceName}
                onChange={(e) => handleChange("practiceName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={client.category} onValueChange={(value) => handleChange("category", value)}>
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
              <Label htmlFor="primaryContact">Primary Contact</Label>
              <Input
                id="primaryContact"
                value={client.primaryContact}
                onChange={(e) => handleChange("primaryContact", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={client.email}
                onChange={(e) => handleChange("email", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={client.phone} onChange={(e) => handleChange("phone", e.target.value)} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input
                id="street"
                value={client.address.street}
                onChange={(e) => handleChange("address.street", e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={client.address.city}
                  onChange={(e) => handleChange("address.city", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Select value={client.state} onValueChange={(value) => handleChange("state", value)}>
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
              <Input
                id="zipCode"
                value={client.address.zipCode}
                onChange={(e) => handleChange("address.zipCode", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Billing Information */}
        <Card>
          <CardHeader>
            <CardTitle>Billing Information</CardTitle>
            <CardDescription>Billing contact and identifiers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="taxId">Tax ID</Label>
              <Input id="taxId" value={client.taxId} onChange={(e) => handleChange("taxId", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="npi">NPI</Label>
              <Input id="npi" value={client.npi} onChange={(e) => handleChange("npi", e.target.value)} />
            </div>

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="billingContactName">Billing Contact Name</Label>
              <Input
                id="billingContactName"
                value={client.billingInfo.contactName}
                onChange={(e) => handleChange("billingInfo.contactName", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingContactEmail">Billing Contact Email</Label>
              <Input
                id="billingContactEmail"
                type="email"
                value={client.billingInfo.contactEmail}
                onChange={(e) => handleChange("billingInfo.contactEmail", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="billingContactPhone">Billing Contact Phone</Label>
              <Input
                id="billingContactPhone"
                value={client.billingInfo.contactPhone}
                onChange={(e) => handleChange("billingInfo.contactPhone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notes */}
      <Card>
        <CardHeader>
          <CardTitle>Notes</CardTitle>
          <CardDescription>Additional information about this client</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea value={client.notes} onChange={(e) => handleChange("notes", e.target.value)} rows={4} />
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
