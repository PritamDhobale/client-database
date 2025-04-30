"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, FileSpreadsheet, Eye, Search, X } from "lucide-react"
import { ReportPreview } from "@/components/report-preview"
import { SchemaReference } from "@/components/schema-reference"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { supabase } from "@/lib/supabaseClient"
import jsPDF from "jspdf";
import "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Papa from "papaparse";


interface ReportsGeneratorProps {
  type: "client" | "agreement" | "service" | "financial"
}

// Report types based on the selected category
const reportTypes = {
  client: [
    { id: "client-list", name: "Client List" },
    { id: "client-status", name: "Client Status Report" },
  ],
  agreement: [
    { id: "agreement-list", name: "Agreement List" },
    { id: "agreement-expiry", name: "Agreement Expiry Report" },
  ],
  service: [
    { id: "service-list", name: "Service List" },
    { id: "service-rates", name: "Service Rates Report" },
  ],
  financial: [
    { id: "financial-summary", name: "Financial Summary" },
  ],
}

export function ReportsGenerator({ type }: ReportsGeneratorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [reportFormat, setReportFormat] = useState("pdf")
  const [dateRange, setDateRange] = useState("last30")
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date().toISOString().split("T")[0],
    endDate: new Date().toISOString().split("T")[0],
  })
  const [selectedReportType, setSelectedReportType] = useState(reportTypes[type][0].id)
  const [selectedClients, setSelectedClients] = useState<string[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<any>(null)
  const [showSchemaReference, setShowSchemaReference] = useState(false)
  const [activeTab, setActiveTab] = useState("generate")

  const [clients, setClients] = useState<any[]>([])

  // Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: clientsData, error: clientsError } = await supabase
          .from("Clients")
          .select("client_id, practice_name, primary_contact_first_name, client_status")

        if (clientsError) throw clientsError

        const { data: agreementsData, error: agreementsError } = await supabase
          .from("agreements")
          .select("agreement_id, client_id, agreement_date, end_date")

        if (agreementsError) throw agreementsError

        const { data: servicesData, error: servicesError } = await supabase
          .from("client_services")
          .select("id, client_id, services(service_name), rate, npp_status")

        if (servicesError) throw servicesError

        // Combine all data into one object
        const combinedData = clientsData.map(client => {
          const clientAgreements = agreementsData.filter(agreement => agreement.client_id === client.client_id)
          const clientServices = servicesData.filter(service => service.client_id === client.client_id)
          return {
            ...client,
            agreements: clientAgreements,
            services: clientServices,
          }
        })

        setClients(combinedData) // Save the combined data in state
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }

    fetchData()
  }, [])

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.practice_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.client_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const exportReportToPDF = () => {
    const doc = new jsPDF();
  
    // Add Title
    doc.text("Client Report", 10, 10);
  
    // Prepare the data
    const tableData = reportData.map((client: any) => [
      client.client_id,
      client.practice_name,
      client.primary_contact_first_name,
      client.client_status === "active" ? "Active" : "Inactive"
    ]);
  
    // Add the table
    doc.autoTable({
      head: [["Client ID", "Practice Name", "Primary Contact", "Status"]],
      body: tableData,
    });
  
    // Save the PDF
    doc.save("client-report.pdf");
  };
  

  // Toggle client selection
  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]
    )
  }

  const exportReportToCSV = () => {
    // Convert the report data into CSV
    const csvData = Papa.unparse(reportData.map((client: any) => ({
      "Client ID": client.client_id,
      "Practice Name": client.practice_name,
      "Primary Contact": client.primary_contact_first_name,
      "Status": client.client_status === "active" ? "Active" : "Inactive"
    })));
  
    // Trigger CSV download
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
    saveAs(blob, "client-report.csv");
  };

  const exportReportToExcel = () => {
    // Create a new worksheet from report data
    const ws = XLSX.utils.json_to_sheet(reportData.map((client: any) => ({
      "Client ID": client.client_id,
      "Practice Name": client.practice_name,
      "Primary Contact": client.primary_contact_first_name,
      "Status": client.client_status === "active" ? "Active" : "Inactive"
    })));
  
    // Create a workbook and add the worksheet to it
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Client Report");
  
    // Write the Excel file and trigger download
    XLSX.writeFile(wb, "client-report.xlsx");
  };
  

  // Handle report generation
  const generateReport = () => {
    if (selectedClients.length === 0) return

    setIsGenerating(true)
    setReportData(null)

    // Filter data based on selected report type
    const filteredData = clients
    .filter((client) => selectedClients.includes(client.client_id))
    .map((client) => ({
      client_id: client.client_id,
      practice_name: client.practice_name,
      // Correcting the filtering logic for services and agreements
      services: client.services.filter((service: { service_name: string; rate: string; npp_status: boolean }) =>
        selectedReportType === "service-list"
      ),
      agreements: client.agreements.filter((agreement: { agreement_id: string; agreement_date: string; end_date: string}) =>
        selectedReportType === "agreement-list"
      ),
    }));
  
  setReportData(filteredData);
  setIsGenerating(false);
  setActiveTab("preview");
  
  }

  const exportReport = () => {
    // Export to PDF, CSV, or Excel based on selected format
    switch (reportFormat) {
      case "pdf":
        exportReportToPDF();
        break;
      case "csv":
        exportReportToCSV();
        break;
      case "excel":
        exportReportToExcel();
        break;
      default:
        console.error("Unsupported format");
        break;
    }
  };
  

  // Clear report data
  const clearReport = () => {
    setReportData(null)
    setSelectedClients([])
    setSearchTerm("")
  }

  // Handle bulk client selection
  const handleBulkSelection = (select: boolean) => {
    if (select) {
      setSelectedClients(filteredClients.map((client) => client.client_id))
    } else {
      setSelectedClients([])
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="generate">Generate Report</TabsTrigger>
          <TabsTrigger value="preview" disabled={!reportData}>
            Preview Report
          </TabsTrigger>
          <TabsTrigger value="schema" onClick={() => setShowSchemaReference(true)}>
            Schema Reference
          </TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select value={selectedReportType} onValueChange={setSelectedReportType}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTypes[type].map((report) => (
                      <SelectItem key={report.id} value={report.id}>
                        {report.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="date-range">Date Range</Label>
                <Select value={dateRange} onValueChange={setDateRange}>
                  <SelectTrigger id="date-range">
                    <SelectValue placeholder="Select date range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="last30">Last 30 Days</SelectItem>
                    <SelectItem value="last90">Last 90 Days</SelectItem>
                    <SelectItem value="lastYear">Last Year</SelectItem>
                    <SelectItem value="custom">Custom Range</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dateRange === "custom" && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="start-date">Start Date</Label>
                    <Input
                      id="start-date"
                      type="date"
                      value={customDateRange.startDate}
                      onChange={(e) => setCustomDateRange((prev) => ({ ...prev, startDate: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="end-date">End Date</Label>
                    <Input
                      id="end-date"
                      type="date"
                      value={customDateRange.endDate}
                      onChange={(e) => setCustomDateRange((prev) => ({ ...prev, endDate: e.target.value }))}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="format">Report Format</Label>
                <Select value={reportFormat} onValueChange={setReportFormat}>
                  <SelectTrigger id="format">
                    <SelectValue placeholder="Select format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF</SelectItem>
                    <SelectItem value="csv">CSV</SelectItem>
                    <SelectItem value="excel">Excel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <Button
                  onClick={generateReport}
                  disabled={selectedClients.length === 0 || isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating Report...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Select Clients</Label>
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                  <Input
                    placeholder="Search clients..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-5 w-5 p-0"
                      onClick={() => setSearchTerm("")}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Clear</span>
                    </Button>
                  )}
                </div>
              </div>

              <div className="border rounded-md h-[350px] overflow-y-auto p-2">
                {filteredClients.length === 0 ? (
                  <div className="text-center py-6 text-gray-500">No clients found</div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between space-x-2 pb-2 border-b">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="select-all"
                          checked={
                            filteredClients.length > 0 &&
                            filteredClients.every((client) => selectedClients.includes(client.client_id))
                          }
                          onCheckedChange={(checked) => handleBulkSelection(!!checked)}
                        />
                        <Label htmlFor="select-all">Select All</Label>
                      </div>
                      {selectedClients.length > 0 && (
                        <Button variant="ghost" size="sm" onClick={() => handleBulkSelection(false)}>
                          Clear Selection
                        </Button>
                      )}
                    </div>
                    {filteredClients.map((client) => (
                      <div key={client.client_id} className="flex items-center space-x-2">
                        <Checkbox
                          id={client.client_id}
                          checked={selectedClients.includes(client.client_id)}
                          onCheckedChange={() => toggleClient(client.client_id)}
                        />
                        <Label htmlFor={client.client_id} className="flex-1">
                          <span className="font-medium">{client.practice_name}</span>
                          <span className="text-xs text-gray-500 ml-2">{client.client_id}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {selectedClients.length} of {filteredClients.length} clients selected
              </div>
            </div>
          </div>

          {reportData && (
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={clearReport}>
                Clear Report
              </Button>
              <Button onClick={() => setActiveTab("preview")}>
                <Eye className="mr-2 h-4 w-4" />
                View Report
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <ReportPreview
            reportType={selectedReportType}
            reportData={reportData}
            isLoading={isGenerating}
            selectedClients={selectedClients}
            dateRange={dateRange}
            customDateRange={dateRange === "custom" ? customDateRange : undefined}
          />

          <div className="flex justify-end mt-4 space-x-2">
              <Button variant="outline" onClick={() => setActiveTab("generate")}>
                Back to Generator
              </Button>
              <Button variant="outline" onClick={exportReport}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Export as CSV
              </Button>
              <Button onClick={exportReport}>
                <Download className="mr-2 h-4 w-4" />
                Download as {reportFormat.toUpperCase()}
              </Button>
          </div>
        </TabsContent>

        <TabsContent value="schema" className="mt-4">
          <SchemaReference />
        </TabsContent>
      </Tabs>
    </div>
  )
}
