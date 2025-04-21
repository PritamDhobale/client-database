"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Download } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ExportServicesDialogProps {
  trigger?: React.ReactNode
  onExport?: (columns: string[], format: string) => void
}

export function ExportServicesDialog({ trigger, onExport }: ExportServicesDialogProps) {
  const [open, setOpen] = useState(false)
  const [selectedColumns, setSelectedColumns] = useState<string[]>([
    "id",
    "clientId",
    "clientName",
    "serviceName",
    "rate",
    "minimumCharge",
    "nppStatus",
  ])
  const [exportFormat, setExportFormat] = useState("csv")
  const [processing, setProcessing] = useState(false)

  // Available columns for export
  const availableColumns = [
    { id: "id", label: "Service ID" },
    { id: "clientId", label: "Client ID" },
    { id: "clientName", label: "Client Name" },
    { id: "serviceName", label: "Service Name" },
    { id: "rate", label: "Rate" },
    { id: "minimumCharge", label: "Minimum Charge" },
    { id: "nppStatus", label: "NPP Status" },
    { id: "notes", label: "Notes" },
    { id: "createdAt", label: "Created Date" },
    { id: "lastModified", label: "Last Modified" },
    { id: "createdBy", label: "Created By" },
  ]

  const toggleColumn = (columnId: string) => {
    setSelectedColumns((prev) => (prev.includes(columnId) ? prev.filter((id) => id !== columnId) : [...prev, columnId]))
  }

  const selectAllColumns = () => {
    setSelectedColumns(availableColumns.map((col) => col.id))
  }

  const deselectAllColumns = () => {
    setSelectedColumns([])
  }

  const handleExport = () => {
    setProcessing(true)

    // In a real app, this would trigger an API call to generate the export
    setTimeout(() => {
      if (onExport) {
        onExport(selectedColumns, exportFormat)
      }
      setProcessing(false)
      setOpen(false)

      // Simulate file download
      const element = document.createElement("a")
      element.setAttribute("href", "data:text/plain;charset=utf-8,")
      element.setAttribute("download", `services_export.${exportFormat}`)
      element.style.display = "none"
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }, 1000)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Services</DialogTitle>
          <DialogDescription>Select the columns you want to include in the export.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <Label className="text-sm font-medium">Columns</Label>
            <div className="space-x-2">
              <Button variant="outline" size="sm" onClick={selectAllColumns}>
                Select All
              </Button>
              <Button variant="outline" size="sm" onClick={deselectAllColumns}>
                Deselect All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 max-h-[200px] overflow-y-auto border rounded-md p-3">
            {availableColumns.map((column) => (
              <div key={column.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`column-${column.id}`}
                  checked={selectedColumns.includes(column.id)}
                  onCheckedChange={() => toggleColumn(column.id)}
                />
                <Label htmlFor={`column-${column.id}`} className="font-normal">
                  {column.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="space-y-2">
            <Label htmlFor="exportFormat">Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger id="exportFormat">
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="xlsx">Excel (XLSX)</SelectItem>
                <SelectItem value="pdf">PDF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={processing || selectedColumns.length === 0}>
            {processing ? "Generating..." : "Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
