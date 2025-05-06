import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuthGuard } from "@/hooks/useAuthGuard"
import { ClientsTable } from "@/components/clients-table"
import { NewClientForm } from "@/components/new-client-form"

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Clients</h1>
        <NewClientForm />
      </div>

      <Tabs defaultValue="active">
        <TabsList>
          <TabsTrigger value="active">Active Clients</TabsTrigger>
          <TabsTrigger value="archived">Archived Clients</TabsTrigger>
        </TabsList>
        <TabsContent value="active" className="mt-4">
          <ClientsTable status="active" />
        </TabsContent>
        <TabsContent value="archived" className="mt-4">
          <ClientsTable status="inactive" />
        </TabsContent>
      </Tabs>
    </div>
  )
}
