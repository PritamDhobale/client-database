"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Search, FileEdit, Download, ChevronDown, ChevronRight, FileText } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { RenewAgreementDialog } from "@/components/renew-agreement-dialog"
import { ExportAgreementsDialog } from "@/components/export-agreements-dialog"

// Mock data
const agreements = [
  {
    id: "AG001",
    clientId: "CL001",
    clientName: "Sunshine Medical Group",
    agreementDate: "2024-01-15",
    commencementDate: "2024-02-01",
    term: "1 year",
    endDate: "2025-02-01",
    status: "active",
    details: [
      { service: "Medical Billing", rate: "$25 per claim" },
      { service: "Coding Review", rate: "$45 per hour" },
    ],
  },
  {
    id: "AG002",
    clientId: "CL002",
    clientName: "Westside Healthcare",
    agreementDate: "2024-02-10",
    commencementDate: "2024-03-01",
    term: "2 years",
    endDate: "2026-03-01",
    status: "active",
    details: [
      { service: "Medical Billing", rate: "$22 per claim" },
      { service: "Credentialing", rate: "$500 per provider" },
    ],
  },
  {
    id: "AG003",
    clientId: "CL003",
    clientName: "Northpark Physicians",
    agreementDate: "2024-01-05",
    commencementDate: "2024-01-15",
    term: "1 year",
    endDate: "2025-01-15",
    status: "active",
    details: [
      { service: "Medical Billing", rate: "$28 per claim" },
      { service: "AR Management", rate: "8% of collections" },
    ],
  },
  {
    id: "AG004",
    clientId: "CL005",
    clientName: "Valley Health Partners",
    agreementDate: "2023-11-20",
    commencementDate: "2023-12-01",
    term: "1 year",
    endDate: "2024-12-01",
    status: "expiring-soon",
    details: [
      { service: "Medical Billing", rate: "$30 per claim" },
      { service: "Denial Management", rate: "$50 per hour" },
    ],
  },
  {
    id: "AG005",
    clientId: "CL007",
    clientName: "Coastal Care Clinic",
    agreementDate: "2023-10-15",
    commencementDate: "2023-11-01",
    term: "1 year",
    endDate: "2024-11-01",
    status: "expiring-soon",
    details: [
      { service: "Medical Billing", rate: "$26 per claim" },
      { service: "Practice Management", rate: "$1,200 per month" },
    ],
  },
]

export function AgreementsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const filteredAgreements = agreements.filter(
    (agreement) =>
      agreement.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.clientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      agreement.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getStatusBadge = (status: string, endDate: string) => {
    const today = new Date()
    const end = new Date(endDate)
    const daysRemaining = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (status === "expired" || end < today) {
      return <Badge variant="destructive">Expired</Badge>
    } else if (status === "expiring-soon" || daysRemaining <= 90) {
      return (
        <Badge variant="outline" className="text-amber-600 border-amber-600">
          Expiring Soon
        </Badge>
      )
    } else {
      return <Badge variant="default">Active</Badge>
    }
  }

  const handleRenewAgreement = (agreementId: string, startDate: string, term: string) => {
    // In a real app, this would be an API call to renew the agreement
    console.log(`Renewing agreement ${agreementId} from ${startDate} with term ${term}`)
    // After successful renewal, you would refresh the agreements list
  }

  const handleExport = (columns: string[], format: string) => {
    // In a real app, this would be an API call to generate the export
    console.log(`Exporting agreements with columns: ${columns.join(", ")} in format: ${format}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search agreements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New Agreement
          </Button>
          <ExportAgreementsDialog onExport={handleExport} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead className="hidden md:table-cell">Agreement Date</TableHead>
              <TableHead className="hidden md:table-cell">Commencement</TableHead>
              <TableHead className="hidden md:table-cell">Term</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAgreements.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No agreements found
                </TableCell>
              </TableRow>
            ) : (
              filteredAgreements.map((agreement) => (
                <>
                  <TableRow
                    key={agreement.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRow(agreement.id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expandedRows[agreement.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{agreement.id}</TableCell>
                    <TableCell>
                      <div>{agreement.clientName}</div>
                      <div className="text-xs text-gray-500">{agreement.clientId}</div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(agreement.agreementDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {new Date(agreement.commencementDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">{agreement.term}</TableCell>
                    <TableCell>{getStatusBadge(agreement.status, agreement.endDate)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <RenewAgreementDialog
                          agreementId={agreement.id}
                          clientName={agreement.clientName}
                          currentEndDate={agreement.endDate}
                          onRenew={handleRenewAgreement}
                        />

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Download PDF
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows[agreement.id] && (
                    <TableRow>
                      <TableCell colSpan={8} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Agreement Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Agreement Date:</div>
                                <div>{new Date(agreement.agreementDate).toLocaleDateString()}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Commencement Date:</div>
                                <div>{new Date(agreement.commencementDate).toLocaleDateString()}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Term:</div>
                                <div>{agreement.term}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">End Date:</div>
                                <div>{new Date(agreement.endDate).toLocaleDateString()}</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Services</h4>
                            <div className="space-y-2">
                              {agreement.details.map((detail, index) => (
                                <div key={index} className="text-sm grid grid-cols-2 gap-2">
                                  <div>{detail.service}:</div>
                                  <div>{detail.rate}</div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
