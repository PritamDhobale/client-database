"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Search, FileEdit, Download, ChevronDown, ChevronRight, FileText } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Badge } from "@/components/ui/badge"
import RenewAgreementDialog from "@/components/renew-agreement-dialog"
import { ExportAgreementsDialog } from "@/components/export-agreements-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@radix-ui/react-dropdown-menu"

// Define the structure of AgreementDetails
interface AgreementDetails {
  agreement_id: number
  client_id: string
  agreement_date: string
  commencement_date: string
  term: string
  end_date: string
  practice_name: string // Removed client object and directly added practice_name
}

export function AgreementsTable() {
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [agreements, setAgreements] = useState<AgreementDetails[]>([])

  useEffect(() => {
    const fetchAgreements = async () => {
      const { data, error } = await supabase
        .from("agreements")
        .select(`
          agreement_id, 
          client_id, 
          agreement_date, 
          commencement_date, 
          term, 
          end_date, 
          clients:client_id(practice_name)  // Join with the clients table to fetch practice_name
        `)
    
      if (error) {
        console.error("Error fetching agreements:", error)
      } else {
        const formattedData: AgreementDetails[] = data.map((agreement: any) => {
          const practice_name = agreement.clients?.practice_name || "Unknown"  // Fetch the practice_name directly
          return {
            agreement_id: agreement.agreement_id,
            client_id: agreement.client_id,
            agreement_date: agreement.agreement_date,
            commencement_date: agreement.commencement_date,
            term: agreement.term,
            end_date: agreement.end_date,
            practice_name,  // Store practice_name directly
          }
        })
        setAgreements(formattedData)
      }
    }
    
    fetchAgreements()
  }, [])

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }


  const groupedAgreements = agreements.reduce((acc: Record<string, any>, agreement: any) => {
    const client_id = agreement.client_id

    if (!acc[client_id]) {
      acc[client_id] = {
        client_id,
        practice_name: agreement.practice_name || "Unknown",  // Directly assign practice_name here
        agreements: []
      }
    }

    acc[client_id].agreements.push({
      agreement_id: agreement.agreement_id,
      client_id: agreement.client_id,
      agreement_date: agreement.agreement_date,
      commencement_date: agreement.commencement_date,
      term: agreement.term,
      end_date: agreement.end_date,
      practice_name: agreement.practice_name || "Unknown"  // Directly assign practice_name
    })

    return acc
  }, {})

  const getStatusBadge = (agreementDate: string, term: string, endDate: string) => {
    const today = new Date()
    let status = "Unknown"
    let end: Date | null = null

    if (endDate) {
      end = new Date(endDate)
    } else if (agreementDate && term) {
      const start = new Date(agreementDate)
      const termInMonths = parseInt(term.split(" ")[0], 10) * 12
      end = new Date(start.setMonth(start.getMonth() + termInMonths))
    }

    if (end) {
      if (end < today) {
        status = "Expired"
      } else if (end >= today) {
        status = "Active"
      }
    }

    return (
      <Badge variant={status === "Expired" ? "destructive" : status === "Active" ? "default" : "outline"}>
        {status}
      </Badge>
    )
  }

  const getStatusBadgeForLatestAgreement = (agreements: AgreementDetails[]) => {
    const today = new Date()
  
    // Sort agreements by end_date descending, fallback to agreement_date
    const sorted = agreements
      .filter(a => a.end_date || a.agreement_date)
      .sort((a, b) => {
        const dateA = new Date(a.end_date || a.agreement_date)
        const dateB = new Date(b.end_date || b.agreement_date)
        return dateB.getTime() - dateA.getTime()
      })
  
    const latest = sorted[0]
    if (!latest) {
      return <Badge variant="outline">Unknown</Badge>
    }
  
    const end = latest.end_date ? new Date(latest.end_date) : null
  
    let status = "Unknown"
    if (end) {
      status = end >= today ? "Active" : "Expired"
    }
  
    return (
      <Badge variant={
        status === "Expired"
          ? "destructive"
          : status === "Active"
          ? "default"
          : "outline" // fallback for "Unknown"
      }>
        {status.toLowerCase()}
      </Badge>
    )    
  }
  

  const filteredAgreements = Object.entries(groupedAgreements)
    .filter(([_, data]) => 
      (data.practice_name || "").toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(([clientId, data]) => ({
      ...data,
      clientId,
    }))

    const handleRenewAgreement = async (agreementId: string, currentEndDate: string, term: string) => {
      const parsedTerm = parseInt(term);
      const isYear = term.toLowerCase().includes("year");
    
      const newStartDate = new Date(currentEndDate);
      const newEndDate = new Date(newStartDate);
    
      if (isYear) {
        newEndDate.setFullYear(newEndDate.getFullYear() + parsedTerm);
      } else {
        newEndDate.setMonth(newEndDate.getMonth() + parsedTerm);
      }
    
      const { error } = await supabase
        .from("agreements")
        .update({
          agreement_date: newStartDate.toISOString(),
          end_date: newEndDate.toISOString(),
        })
        .eq("agreement_id", agreementId);
    
      if (error) {
        console.error("Renewal failed:", error);
      } else {
        console.log("Renewed successfully");
        // optionally refetch agreements
      }
    };
    
    
  
  const handleExport = (columns: string[], format: string) => {
    // In a real app, this would be an API call to generate the export
    console.log(`Exporting agreements with columns: ${columns.join(", ")} in format: ${format}`)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Input
            placeholder="Search agreements..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          {/* <Button variant="outline">
            <FileText className="mr-2 h-4 w-4" />
            New Agreement
          </Button> */}
          <ExportAgreementsDialog onExport={(columns, format) => console.log(`Exporting agreements with columns: ${columns}, format: ${format}`)} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Practice Name</TableHead>
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
              filteredAgreements.map((clientData) => (
                <>
                  <TableRow key={clientData.clientId} className="cursor-pointer hover:bg-gray-50">
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(clientData.clientId)}>
                        {expandedRows[clientData.clientId] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>{clientData.client_id}</TableCell>
                    <TableCell>{clientData.practice_name}</TableCell>
                    <TableCell>
                      {getStatusBadgeForLatestAgreement(clientData.agreements)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      {(() => {
                        type Agreement = { agreement_id: number; end_date?: string; agreement_date?: string }

                        const latestAgreement = (clientData.agreements as Agreement[])
                          .filter((a: Agreement) => a.end_date || a.agreement_date)
                          .sort((a: Agreement, b: Agreement) => {
                            const dateA = new Date(a.end_date || a.agreement_date || "")
                            const dateB = new Date(b.end_date || b.agreement_date || "")
                            return dateB.getTime() - dateA.getTime()
                          })[0];

                        if (!latestAgreement) return null;

                        return (
                          <RenewAgreementDialog
                            key={latestAgreement.agreement_id}
                            agreementId={latestAgreement.agreement_id.toString()}
                            clientId={clientData.clientId} // ✅ NEW LINE
                            clientName={clientData.practice_name}
                            currentEndDate={latestAgreement.end_date || new Date().toISOString()}
                            onRenew={handleRenewAgreement}
                          />
                        );
                      })()}
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

                  {expandedRows[clientData.clientId] && (
                  <TableRow>
                    <TableCell colSpan={8} className="bg-gray-50 p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">Agreement Details</h4>
                          <div className="space-y-2 text-sm">
                          {clientData.agreements.map((agreement: AgreementDetails, index: number) => (
                          <div key={agreement.agreement_id || index} className="grid grid-cols-2 gap-2">
                            <div className="text-gray-500">Agreement Date:</div>
                            <div>{agreement.agreement_date ? new Date(agreement.agreement_date).toLocaleDateString() : "N/A"}</div>
                            <div className="text-gray-500">Commencement Date:</div>
                            <div>{agreement.commencement_date ? new Date(agreement.commencement_date).toLocaleDateString() : "N/A"}</div>
                            <div className="text-gray-500">Term:</div>
                            <div>{agreement.term}</div>
                            <div className="text-gray-500">End Date:</div>
                            <div>{agreement.end_date ? new Date(agreement.end_date).toLocaleDateString() : "N/A"}</div>
                            <p>--------------------------------------</p>
                            <Separator />
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
