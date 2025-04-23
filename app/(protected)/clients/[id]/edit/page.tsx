"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, X } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useParams } from "next/navigation"

interface Client {
  client_id: string;
  practice_name: string;
  primary_contact_first_name: string;
  primary_contact_last_name: string;
  email: string;
  state: string;
  category_id: string;
  client_status: string;
  dba: string;
  code: string;
  sla_number: string;
  primary_contact_title: string;
  primary_contact_phone: string;
  admin_contact_first_name: string;
  admin_contact_last_name: string;
  admin_contact_phone: string;
  admin_contact_title: string;
  admin_contact_email: string;
  authorized_rep_first_name: string;
  authorized_rep_last_name: string;
  authorized_rep_phone: string;
  authorized_rep_title: string;
  authorized_rep_email: string;
  city: string;
  state_of_formation: string;
  street_address: string;
  current_ehr: string;
  type_of_entity: string;
  website: string;
  zip: string;
}

// List of US states for the dropdown
const US_STATES = [
  "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
  "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD",
  "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY",
]

// Fetch categories from Supabase
const fetchCategories = async () => {
  const { data, error } = await supabase.from("category").select("category_id, category_name")
  if (error) {
    console.error("Error fetching categories:", error)
    return []
  }
  return data || []
}

export default function ClientEditPage() {
  const params = useParams();
  const clientId = params?.id as string;
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [categories, setCategories] = useState<any[]>([])

  useEffect(() => {
    const fetchClient = async () => {
      const { data, error } = await supabase
        .from("Clients")
        .select(`
          *,
          category:category_id (category_name)
        `)
        .eq("client_id", Number(clientId))
        .single()

      if (error) {
        console.error("Failed to fetch client", error)
      } else {
        setClient(data)
      }

      setLoading(false)
    }
    const loadCategories = async () => {
      const fetchedCategories = await fetchCategories()
      setCategories(fetchedCategories)
    }

    fetchClient()
    loadCategories()
  }, [clientId])

  const handleChange = (field: keyof Client, value: string) => {
    setClient((prev) => (prev ? { ...prev, [field]: value } : prev))
  }

  const handleSave = () => {
    setSaving(true);

    const updateClient = async () => {
      if (!client) return;

      const { data, error } = await supabase
        .from("Clients")
        .update({
          practice_name: client.practice_name,
          primary_contact_first_name: client.primary_contact_first_name,
          primary_contact_last_name: client.primary_contact_last_name,
          email: client.email,
          primary_contact_title: client.primary_contact_title,
          primary_contact_phone: client.primary_contact_phone,
          state: client.state,
          category_id: client.category_id,
          client_status: client.client_status,

          // Additional fields
          dba: client.dba,
          code: client.code,
          sla_number: client.sla_number,
          admin_contact_first_name: client.admin_contact_first_name,
          admin_contact_last_name: client.admin_contact_last_name,
          admin_contact_phone: client.admin_contact_phone,
          admin_contact_title: client.admin_contact_title,
          admin_contact_email: client.admin_contact_email,
          authorized_rep_first_name: client.authorized_rep_first_name,
          authorized_rep_last_name: client.authorized_rep_last_name,
          authorized_rep_phone: client.authorized_rep_phone,
          authorized_rep_title: client.authorized_rep_title,
          authorized_rep_email: client.authorized_rep_email,
          city: client.city,
          state_of_formation: client.state_of_formation,
          street_address: client.street_address,
          current_ehr: client.current_ehr,
          type_of_entity: client.type_of_entity,
          website: client.website,
          zip: client.zip,

          // Optional additional fields (if needed)
          updated_at: new Date().toISOString(), // ✅ FORCE UPDATE
        })
        .eq("client_id", client.client_id)
        .select("*");

      if (error) {
        console.error("Error updating client:", error);
      } else if (data?.length === 0) {
        console.warn("⚠️ No rows were updated. Maybe no values changed.");
      } else {
        console.log("✅ Updated client:", data);
        router.push(`/clients/${client.client_id}`);
      }

      setSaving(false);
    };

    updateClient();
  };

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
          <Button variant="outline" onClick={() => router.push(`/clients/${client.client_id}`)}>
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
              <Label htmlFor="practice_name">Practice Name</Label>
              <Input
                id="practice_name"
                value={client.practice_name}
                onChange={(e) => handleChange("practice_name", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_name">Category Name</Label>
              <Select value={client.category_id} onValueChange={(value) => handleChange("category_id", value)}>
                <SelectTrigger id="category_name">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.category_id} value={category.category_id}>
                      {category.category_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_first_name">Primary Contact First Name</Label>
              <Input
                id="primary_contact_first_name"
                value={client.primary_contact_first_name}
                onChange={(e) => handleChange("primary_contact_first_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_contact_last_name">Primary Contact Last Name</Label>
              <Input
                id="primary_contact_last_name"
                value={client.primary_contact_last_name}
                onChange={(e) => handleChange("primary_contact_last_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_contact_title">Primary Contact Title</Label>
              <Input
                id="primary_contact_title"
                value={client.primary_contact_title}
                onChange={(e) => handleChange("primary_contact_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_contact_email">Primary Contact Email</Label>
              <Input
                id="primary_contact_email"
                value={client.primary_contact_email}
                onChange={(e) => handleChange("primary_contact_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="primary_contact_phone">Primary Contact Phone</Label>
              <Input
                id="primary_contact_phone"
                value={client.primary_contact_phone}
                onChange={(e) => handleChange("primary_contact_phone", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_first_name">Admin Contact First Name</Label>
              <Input
                id="admin_contact_first_name"
                value={client.admin_contact_first_name}
                onChange={(e) => handleChange("admin_contact_first_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_contact_last_name">Admin Contact Last Name</Label>
              <Input
                id="admin_contact_last_name"
                value={client.admin_contact_last_name}
                onChange={(e) => handleChange("admin_contact_last_name", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_contact_title">Admin Contact Title</Label>
              <Input
                id="admin_contact_title"
                value={client.admin_contact_title}
                onChange={(e) => handleChange("admin_contact_title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_contact_email">Admin Contact Email</Label>
              <Input
                id="admin_contact_email"
                value={client.admin_contact_email}
                onChange={(e) => handleChange("admin_contact_email", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="admin_contact_phone">Admin Contact Phone</Label>
              <Input
                id="admin_contact_phone"
                value={client.admin_contact_phone}
                onChange={(e) => handleChange("admin_contact_phone", e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      

                          <Card>
                          <CardHeader>
                            {/* <CardTitle>Billing Information</CardTitle>
                            <CardDescription>Billing contact and identifiers</CardDescription> */}
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="street_address">Street Address</Label>
                              <Input
                                id="street_address"
                                value={client.street_address}
                                onChange={(e) => handleChange("street_address", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="dba">DBA</Label>
                              <Input
                                id="dba"
                                value={client.dba}
                                onChange={(e) => handleChange("dba", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="code">Code</Label>
                              <Input
                                id="code"
                                value={client.code}
                                onChange={(e) => handleChange("code", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="sla_number">SLA Number</Label>
                              <Input
                                id="sla_number"
                                value={client.sla_number}
                                onChange={(e) => handleChange("sla_number", e.target.value)}
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
                              <Label htmlFor="city">City</Label>
                              <Input
                                id="city"
                                value={client.city}
                                onChange={(e) => handleChange("city", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="current_ehr">Current EHR</Label>
                              <Input
                                id="current_ehr"
                                value={client.current_ehr}
                                onChange={(e) => handleChange("current_ehr", e.target.value)}
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

                            <div className="space-y-2">
                              <Label htmlFor="state_of_formation">State Of Formation</Label>
                              <Input
                                id="state_of_formation"
                                value={client.state_of_formation}
                                onChange={(e) => handleChange("state_of_formation", e.target.value)}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="zip">Zip Code</Label>
                              <Input
                                id="zip"
                                value={client.zip}
                                onChange={(e) => handleChange("zip", e.target.value)}
                              />
                            </div>

                          </CardContent>
                        </Card>
      </div>
      {/* Notes Section */}
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
