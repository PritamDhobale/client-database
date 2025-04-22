"use client"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, FileText, Calendar, Edit, Trash2, UploadCloud, RefreshCw } from "lucide-react"
import { ClientDocuments } from "@/components/client-documents"
import { ClientAgreements } from "@/components/client-agreements"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

type Client = {
  client_id: number
  practice_name: string
  primary_contact: string
  email: string
  phone: string
  state: string
  street_address: string
  city: string
  zip_code: string
  tax_id: string
  npi: string
  billing_contact_name: string
  billing_contact_email: string
  billing_contact_phone: string
  notes: string
  created_at: string // optional in case it's auto-generated
  status: string
  category: string
}


// export default function ClientDetailPage({ params }: { params: { id: string } }) {
  export default function ClientDetailPage(props: any) {
    const params = useParams()
  const router = useRouter()
  const [client, setClient] = useState<Client | null>(null)
  const [loading, setLoading] = useState(true)
  const [showArchiveDialog, setShowArchiveDialog] = useState(false)
  const [showRestoreDialog, setShowRestoreDialog] = useState(false)

  const fetchClient = async () => {
    const { data, error } = await supabase
      .from("Clients")
      .select("*")
      .eq("client_id", params.id)
      .single()
  
    if (error) {
      console.error("Error fetching client", error)
    } else {
      setClient(data)
    }
    setLoading(false)
  }
  useEffect(() => {
    fetchClient()
  }, [params.id])
  

  const handleArchiveClient = async () => {
    const { error } = await supabase
      .from("Clients")
      .update({ status: "inactive" })
      .eq("client_id", client?.client_id)
  
    if (error) {
      console.error("Failed to archive client:", error)
    } else {
      setShowArchiveDialog(false)
      router.push("/clients")
    }
  }
  

  const handleRestoreClient = async () => {
    const { error } = await supabase
      .from("Clients")
      .update({ status: "active" })
      .eq("client_id", client?.client_id)
  
    if (error) {
      console.error("Failed to restore client:", error)
    } else {
      setShowRestoreDialog(false)
      router.push("/clients")
    }
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
      {/* Archive Confirmation Dialog */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive {client.practice_name}? The client will be marked as inactive but all data
              will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleArchiveClient} className="bg-red-600 hover:bg-red-700">
              Archive
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={showRestoreDialog} onOpenChange={setShowRestoreDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore {client.practice_name}? The client will be marked as active again.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRestoreClient} className="bg-green-600 hover:bg-green-700">
              Restore
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header with back button and actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <Button variant="ghost" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{client.practice_name}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={client.status === "active" ? "default" : "secondary"}>
                {client.status === "active" ? "Active" : "Inactive"}
              </Badge>
              <span className="text-sm text-gray-500">ID: {client.client_id}</span>
              <span className="text-sm text-gray-500">•</span>
              <span className="text-sm text-gray-500">Added {new Date(client.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => router.push(`/clients/${client.client_id}/edit`)}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Client
          </Button>
          {client.status === "active" ? (
            <Button
              variant="outline"
              className="text-red-600 hover:text-red-700"
              onClick={() => setShowArchiveDialog(true)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Archive
            </Button>
          ) : (
            <Button
              variant="outline"
              className="text-green-600 hover:text-green-700"
              onClick={() => setShowRestoreDialog(true)}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Restore
            </Button>
          )}
        </div>
      </div>

      {/* Client details tabs */}
      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>Client profile and contact details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Practice Name</p>
                    <p>{client.practice_name}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Category</p>
                    <p>{client.category}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Primary Contact</p>
                    <p>{client.primary_contact}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p>{client.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p>{client.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">State</p>
                    <p>{client.state}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Address</p>
                  <p>{client.street_address}</p>
                  <p>
                    {client.city}, {client.state} {client.zip_code}
                  </p>
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Tax ID</p>
                    <p>{client.tax_id}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">NPI</p>
                    <p>{client.npi}</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <p className="text-sm font-medium text-gray-500">Billing Contact</p>
                  <p>{client.billing_contact_name}</p>
                  <p>{client.billing_contact_email}</p>
                  <p>{client.billing_contact_phone}</p>
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
              <p>{client.notes}</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Documents</CardTitle>
                <CardDescription>Client-related files and documents</CardDescription>
              </div>
              <FileUploadDialog
                clientId={client.client_id.toString()}
                clientName={client.practice_name}
                trigger={
                  <Button>
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                }
              />
            </CardHeader>
            {/* <CardContent>
              <ClientDocuments clientId={client.client_id.toString()}
 documents={client.documents || []} />
            </CardContent> */}
          </Card>
        </TabsContent>

        <TabsContent value="agreements" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Agreements</CardTitle>
                <CardDescription>Client contracts and agreements</CardDescription>
              </div>
              <Button>
                <FileText className="mr-2 h-4 w-4" />
                New Agreement
              </Button>
            </CardHeader>
            <CardContent>
              <ClientAgreements clientId={client.client_id.toString()}
 />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Services</CardTitle>
                <CardDescription>Services provided to this client</CardDescription>
              </div>
              <Button>
                <Calendar className="mr-2 h-4 w-4" />
                Add Service
              </Button>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8 text-gray-500">No services have been added for this client yet.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
