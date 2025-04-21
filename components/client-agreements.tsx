import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, Eye, FileEdit } from "lucide-react"

interface ClientAgreementsProps {
  clientId: string
}

// Mock agreements data
const agreements = [
  {
    id: "AG001",
    clientId: "CL001",
    agreementDate: "2024-01-15",
    commencementDate: "2024-02-01",
    term: "1 year",
    endDate: "2025-02-01",
    status: "active",
  },
  {
    id: "AG006",
    clientId: "CL001",
    agreementDate: "2023-01-10",
    commencementDate: "2023-02-01",
    term: "1 year",
    endDate: "2024-02-01",
    status: "expired",
  },
  {
    id: "AG012",
    clientId: "CL002",
    agreementDate: "2024-02-10",
    commencementDate: "2024-03-01",
    term: "2 years",
    endDate: "2026-03-01",
    status: "active",
  },
  {
    id: "AG015",
    clientId: "CL003",
    agreementDate: "2024-01-05",
    commencementDate: "2024-01-15",
    term: "1 year",
    endDate: "2025-01-15",
    status: "active",
  },
  {
    id: "AG018",
    clientId: "CL005",
    agreementDate: "2023-11-20",
    commencementDate: "2023-12-01",
    term: "1 year",
    endDate: "2024-12-01",
    status: "expiring-soon",
  },
]

export function ClientAgreements({ clientId }: ClientAgreementsProps) {
  // Filter agreements for this client
  const clientAgreements = agreements.filter((agreement) => agreement.clientId === clientId)

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge variant="default">Active</Badge>
      case "expiring-soon":
        return (
          <Badge variant="outline" className="text-amber-600 border-amber-600">
            Expiring Soon
          </Badge>
        )
      case "expired":
        return <Badge variant="secondary">Expired</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  if (clientAgreements.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No agreements have been created for this client yet.</p>
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Agreement Date</TableHead>
          <TableHead>Commencement</TableHead>
          <TableHead>Term</TableHead>
          <TableHead>End Date</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {clientAgreements.map((agreement) => (
          <TableRow key={agreement.id}>
            <TableCell className="font-medium">{agreement.id}</TableCell>
            <TableCell>{new Date(agreement.agreementDate).toLocaleDateString()}</TableCell>
            <TableCell>{new Date(agreement.commencementDate).toLocaleDateString()}</TableCell>
            <TableCell>{agreement.term}</TableCell>
            <TableCell>{new Date(agreement.endDate).toLocaleDateString()}</TableCell>
            <TableCell>{getStatusBadge(agreement.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="sm">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="ghost" size="sm">
                  <FileEdit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
                <Button variant="ghost" size="sm">
                  <Download className="h-4 w-4 mr-1" />
                  PDF
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
