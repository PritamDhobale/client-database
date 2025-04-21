"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, FileSpreadsheet, Printer, Copy, Check } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"

interface ReportPreviewProps {
  reportType: string
  reportData: any
  isLoading: boolean
  selectedClients: string[]
  dateRange: string
  customDateRange?: { startDate: string; endDate: string }
}

export function ReportPreview({
  reportType,
  reportData,
  isLoading,
  selectedClients,
  dateRange,
  customDateRange,
}: ReportPreviewProps) {
  const [activeView, setActiveView] = useState("preview")
  const [copied, setCopied] = useState(false)

  // Reset copied state after 2 seconds
  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000)
      return () => clearTimeout(timer)
    }
  }, [copied])

  // Format date range for display
  const getFormattedDateRange = () => {
    if (dateRange === "custom" && customDateRange) {
      return `${new Date(customDateRange.startDate).toLocaleDateString()} - ${new Date(
        customDateRange.endDate,
      ).toLocaleDateString()}`
    }

    switch (dateRange) {
      case "last30":
        return "Last 30 Days"
      case "last90":
        return "Last 90 Days"
      case "lastYear":
        return "Last Year"
      default:
        return "Custom Range"
    }
  }

  // Handle copy to clipboard
  const handleCopy = () => {
    if (reportData) {
      // In a real app, this would format the data properly
      const textData = JSON.stringify(reportData, null, 2)
      navigator.clipboard.writeText(textData)
      setCopied(true)
    }
  }

  // Generate mock report data based on report type
  const generateMockReportData = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
        </div>
      )
    }

    if (!reportData || selectedClients.length === 0) {
      return (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Data Available</h3>
          <p className="text-sm text-gray-400 mt-2">
            {selectedClients.length === 0
              ? "Please select at least one client to generate a report."
              : "No data available for the selected criteria."}
          </p>
        </div>
      )
    }

    // Different preview based on report type
    switch (reportType) {
      case "client-list":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Client List Report</h3>
              <Badge variant="outline">{getFormattedDateRange()}</Badge>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Practice Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Primary Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.slice(0, 5).map((client: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{client.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.practiceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{client.primaryContact}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={client.status === "active" ? "default" : "secondary"}>
                        {client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 5 && (
              <p className="text-sm text-gray-500 italic text-center">
                Showing 5 of {reportData.length} records. Download the full report to see all data.
              </p>
            )}
          </div>
        )

      case "agreement-list":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Agreement List Report</h3>
              <Badge variant="outline">{getFormattedDateRange()}</Badge>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agreement ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Start Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    End Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.slice(0, 5).map((agreement: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agreement.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agreement.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(agreement.startDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(agreement.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge
                        variant={
                          agreement.status === "active"
                            ? "default"
                            : agreement.status === "expiring-soon"
                              ? "outline"
                              : "secondary"
                        }
                        className={agreement.status === "expiring-soon" ? "text-amber-600 border-amber-600" : undefined}
                      >
                        {agreement.status === "active"
                          ? "Active"
                          : agreement.status === "expiring-soon"
                            ? "Expiring Soon"
                            : "Expired"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 5 && (
              <p className="text-sm text-gray-500 italic text-center">
                Showing 5 of {reportData.length} records. Download the full report to see all data.
              </p>
            )}
          </div>
        )

      case "service-list":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Service List Report</h3>
              <Badge variant="outline">{getFormattedDateRange()}</Badge>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NPP Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.slice(0, 5).map((service: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.serviceName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.rate}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Badge variant={service.nppStatus ? "default" : "secondary"}>
                        {service.nppStatus ? "Active" : "Inactive"}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {reportData.length > 5 && (
              <p className="text-sm text-gray-500 italic text-center">
                Showing 5 of {reportData.length} records. Download the full report to see all data.
              </p>
            )}
          </div>
        )

      case "financial-summary":
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Financial Summary Report</h3>
              <Badge variant="outline">{getFormattedDateRange()}</Badge>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Claims
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg. Per Claim
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {reportData.slice(0, 5).map((item: any, index: number) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.clientName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${item.revenue.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.claims}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ${(item.revenue / item.claims).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot className="bg-gray-50">
                <tr>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                    ${reportData.reduce((sum: number, item: any) => sum + item.revenue, 0).toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                    {reportData.reduce((sum: number, item: any) => sum + item.claims, 0)}
                  </td>
                  <td className="px-6 py-3 text-left text-xs font-medium text-gray-900">
                    $
                    {(
                      reportData.reduce((sum: number, item: any) => sum + item.revenue, 0) /
                      reportData.reduce((sum: number, item: any) => sum + item.claims, 0)
                    ).toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
            {reportData.length > 5 && (
              <p className="text-sm text-gray-500 italic text-center">
                Showing 5 of {reportData.length} records. Download the full report to see all data.
              </p>
            )}
          </div>
        )

      default:
        return (
          <div className="text-center py-8">
            <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">Report Preview</h3>
            <p className="text-sm text-gray-400 mt-2">Select a report type to preview data.</p>
          </div>
        )
    }
  }

  // Generate JSON view
  const generateJsonView = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </div>
      )
    }

    if (!reportData || selectedClients.length === 0) {
      return (
        <div className="text-center py-8">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-500">No Data Available</h3>
          <p className="text-sm text-gray-400 mt-2">
            {selectedClients.length === 0
              ? "Please select at least one client to generate a report."
              : "No data available for the selected criteria."}
          </p>
        </div>
      )
    }

    return (
      <div className="relative">
        <Button
          variant="outline"
          size="sm"
          className="absolute right-0 top-0 m-2"
          onClick={handleCopy}
          disabled={!reportData}
        >
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <pre className="bg-gray-50 p-4 rounded-md overflow-auto max-h-[400px] text-xs">
          {JSON.stringify(reportData, null, 2)}
        </pre>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-4">
        <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
          <div className="flex justify-between items-center mb-4">
            <TabsList>
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled={!reportData || isLoading}>
                <Printer className="h-4 w-4 mr-1" />
                Print
              </Button>
              <Button variant="outline" size="sm" disabled={!reportData || isLoading}>
                <FileSpreadsheet className="h-4 w-4 mr-1" />
                CSV
              </Button>
              <Button disabled={!reportData || isLoading}>
                <Download className="h-4 w-4 mr-1" />
                PDF
              </Button>
            </div>
          </div>

          <TabsContent value="preview" className="mt-0">
            {generateMockReportData()}
          </TabsContent>

          <TabsContent value="json" className="mt-0">
            {generateJsonView()}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
