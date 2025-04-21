"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { FileText, Download, FileSpreadsheet, Eye, Search, X } from "lucide-react"
import { ReportPreview } from "@/components/report-preview"
import { SchemaReference } from "@/components/schema-reference"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ReportsGeneratorProps {
  type: "client" | "agreement" | "service" | "financial"
}

// Mock clients data
const clients = [
  { id: "CL001", name: "Sunshine Medical Group" },
  { id: "CL002", name: "Westside Healthcare" },
  { id: "CL003", name: "Northpark Physicians" },
  { id: "CL005", name: "Valley Health Partners" },
  { id: "CL007", name: "Coastal Care Clinic" },
  { id: "CL008", name: "Mountain View Medical" },
  { id: "CL009", name: "Riverdale Health Services" },
]

// Mock report types based on the selected category
const reportTypes = {
  client: [
    { id: "client-list", name: "Client List" },
    { id: "client-status", name: "Client Status Report" },
    { id: "client-demographics", name: "Client Demographics" },
  ],
  agreement: [
    { id: "agreement-list", name: "Agreement List" },
    { id: "agreement-expiry", name: "Agreement Expiry Report" },
    { id: "agreement-renewal", name: "Agreement Renewal History" },
  ],
  service: [
    { id: "service-list", name: "Service List" },
    { id: "service-rates", name: "Service Rates Report" },
    { id: "service-npp", name: "NPP Status Report" },
  ],
  financial: [
    { id: "financial-summary", name: "Financial Summary" },
    { id: "revenue-by-client", name: "Revenue by Client" },
    { id: "billing-performance", name: "Billing Performance" },
  ],
}

// Mock report data
const mockReportData = {
  "client-list": [
    {
      id: "CL001",
      practiceName: "Sunshine Medical Group",
      primaryContact: "Dr. Sarah Johnson",
      email: "sjohnson@sunshinemedical.com",
      status: "active",
    },
    {
      id: "CL002",
      practiceName: "Westside Healthcare",
      primaryContact: "Dr. Michael Chen",
      email: "mchen@westsidehc.com",
      status: "active",
    },
    {
      id: "CL003",
      practiceName: "Northpark Physicians",
      primaryContact: "Dr. Robert Williams",
      email: "rwilliams@northparkphys.com",
      status: "active",
    },
    {
      id: "CL004",
      practiceName: "Eastside Medical Center",
      primaryContact: "Dr. Emily Rodriguez",
      email: "erodriguez@eastsidemc.com",
      status: "inactive",
    },
    {
      id: "CL005",
      practiceName: "Valley Health Partners",
      primaryContact: "Dr. James Smith",
      email: "jsmith@valleyhp.com",
      status: "active",
    },
    {
      id: "CL007",
      practiceName: "Coastal Care Clinic",
      primaryContact: "Dr. David Kim",
      email: "dkim@coastalcare.com",
      status: "active",
    },
  ],
  "agreement-list": [
    {
      id: "AG001",
      clientId: "CL001",
      clientName: "Sunshine Medical Group",
      startDate: "2024-02-01",
      endDate: "2025-02-01",
      status: "active",
    },
    {
      id: "AG002",
      clientId: "CL002",
      clientName: "Westside Healthcare",
      startDate: "2024-03-01",
      endDate: "2026-03-01",
      status: "active",
    },
    {
      id: "AG003",
      clientId: "CL003",
      clientName: "Northpark Physicians",
      startDate: "2024-01-15",
      endDate: "2025-01-15",
      status: "active",
    },
    {
      id: "AG004",
      clientId: "CL005",
      clientName: "Valley Health Partners",
      startDate: "2023-12-01",
      endDate: "2024-12-01",
      status: "expiring-soon",
    },
    {
      id: "AG005",
      clientId: "CL007",
      clientName: "Coastal Care Clinic",
      startDate: "2023-11-01",
      endDate: "2024-11-01",
      status: "expiring-soon",
    },
    {
      id: "AG006",
      clientId: "CL001",
      clientName: "Sunshine Medical Group",
      startDate: "2023-02-01",
      endDate: "2024-02-01",
      status: "expired",
    },
  ],
  "service-list": [
    {
      id: "SV001",
      clientId: "CL001",
      clientName: "Sunshine Medical Group",
      serviceName: "Medical Billing",
      rate: "$25 per claim",
      nppStatus: true,
    },
    {
      id: "SV002",
      clientId: "CL001",
      clientName: "Sunshine Medical Group",
      serviceName: "Coding Review",
      rate: "$45 per hour",
      nppStatus: true,
    },
    {
      id: "SV003",
      clientId: "CL002",
      clientName: "Westside Healthcare",
      serviceName: "Medical Billing",
      rate: "$22 per claim",
      nppStatus: true,
    },
    {
      id: "SV004",
      clientId: "CL002",
      clientName: "Westside Healthcare",
      serviceName: "Credentialing",
      rate: "$500 per provider",
      nppStatus: false,
    },
    {
      id: "SV005",
      clientId: "CL003",
      clientName: "Northpark Physicians",
      serviceName: "Medical Billing",
      rate: "$28 per claim",
      nppStatus: true,
    },
    {
      id: "SV006",
      clientId: "CL003",
      clientName: "Northpark Physicians",
      serviceName: "AR Management",
      rate: "8% of collections",
      nppStatus: true,
    },
  ],
  "financial-summary": [
    {
      clientId: "CL001",
      clientName: "Sunshine Medical Group",
      revenue: 45250.75,
      claims: 1810,
    },
    {
      clientId: "CL002",
      clientName: "Westside Healthcare",
      revenue: 32180.5,
      claims: 1463,
    },
    {
      clientId: "CL003",
      clientName: "Northpark Physicians",
      revenue: 28975.25,
      claims: 1035,
    },
    {
      clientId: "CL005",
      clientName: "Valley Health Partners",
      revenue: 18450.0,
      claims: 615,
    },
    {
      clientId: "CL007",
      clientName: "Coastal Care Clinic",
      revenue: 12780.3,
      claims: 492,
    },
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

  // Filter clients based on search term
  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Toggle client selection
  const toggleClient = (clientId: string) => {
    setSelectedClients((prev) => (prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId]))
  }

  // Generate report
  const generateReport = () => {
    if (selectedClients.length === 0) return

    setIsGenerating(true)
    setReportData(null)

    // Simulate API call to generate report
    setTimeout(() => {
      // Filter mock data based on selected clients
      const filteredData = mockReportData[selectedReportType as keyof typeof mockReportData]?.filter((item: any) =>
        selectedClients.includes(item.clientId),
      )

      setReportData(filteredData || [])
      setIsGenerating(false)
      setActiveTab("preview")
    }, 1500)
  }

  // Clear report
  const clearReport = () => {
    setReportData(null)
    setSelectedClients([])
    setSearchTerm("")
  }

  // Handle bulk selection
  const handleBulkSelection = (select: boolean) => {
    if (select) {
      setSelectedClients(filteredClients.map((client) => client.id))
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
                            filteredClients.every((client) => selectedClients.includes(client.id))
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
                      <div key={client.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={client.id}
                          checked={selectedClients.includes(client.id)}
                          onCheckedChange={() => toggleClient(client.id)}
                        />
                        <Label htmlFor={client.id} className="flex-1">
                          <span className="font-medium">{client.name}</span>
                          <span className="text-xs text-gray-500 ml-2">{client.id}</span>
                        </Label>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="text-sm text-gray-500">
                {selectedClients.length} of {clients.length} clients selected
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
            <Button variant="outline">
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              Export as CSV
            </Button>
            <Button>
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
