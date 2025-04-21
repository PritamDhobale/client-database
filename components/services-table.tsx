"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  Search,
  FileEdit,
  Download,
  ChevronDown,
  ChevronRight,
  Check,
  X,
  Filter,
  Trash2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { EditServiceDialog } from "@/components/edit-service-dialog"
import { NewServiceDialog } from "@/components/new-service-dialog"
import { ExportServicesDialog } from "@/components/export-services-dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
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

// Mock data
const initialServices = [
  {
    id: "SV001",
    clientId: "CL001",
    clientName: "Sunshine Medical Group",
    serviceName: "Medical Billing",
    rate: "$25 per claim",
    minimumCharge: "$500 per month",
    nppStatus: true,
    notes: "Includes claim submission, follow-up, and payment posting.",
  },
  {
    id: "SV002",
    clientId: "CL001",
    clientName: "Sunshine Medical Group",
    serviceName: "Coding Review",
    rate: "$45 per hour",
    minimumCharge: "$200 per month",
    nppStatus: true,
    notes: "Quarterly audit of coding practices.",
  },
  {
    id: "SV003",
    clientId: "CL002",
    clientName: "Westside Healthcare",
    serviceName: "Medical Billing",
    rate: "$22 per claim",
    minimumCharge: "$450 per month",
    nppStatus: true,
    notes: "Includes claim submission and payment posting.",
  },
  {
    id: "SV004",
    clientId: "CL002",
    clientName: "Westside Healthcare",
    serviceName: "Credentialing",
    rate: "$500 per provider",
    minimumCharge: "N/A",
    nppStatus: false,
    notes: "One-time fee per provider.",
  },
  {
    id: "SV005",
    clientId: "CL003",
    clientName: "Northpark Physicians",
    serviceName: "Medical Billing",
    rate: "$28 per claim",
    minimumCharge: "$600 per month",
    nppStatus: true,
    notes: "Full-service billing including denial management.",
  },
  {
    id: "SV006",
    clientId: "CL003",
    clientName: "Northpark Physicians",
    serviceName: "AR Management",
    rate: "8% of collections",
    minimumCharge: "$300 per month",
    nppStatus: true,
    notes: "Focused on accounts over 60 days.",
  },
]

// Get unique values for filter options
const getUniqueValues = (field: string) => {
  const values = [...new Set(initialServices.map((service: any) => service[field]))]
  return values.sort()
}

export function ServicesTable() {
  const [services, setServices] = useState(initialServices)
  const [searchTerm, setSearchTerm] = useState("")
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [filters, setFilters] = useState({
    clientId: "",
    clientName: "",
    serviceName: "",
    nppStatus: "",
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null)

  // Get unique values for dropdowns
  const clientIds = getUniqueValues("clientId")
  const clientNames = getUniqueValues("clientName")
  const serviceNames = getUniqueValues("serviceName")

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Update filter
  const updateFilter = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))

    if (value && !activeFilters.includes(field)) {
      setActiveFilters((prev) => [...prev, field])
    } else if (!value && activeFilters.includes(field)) {
      setActiveFilters((prev) => prev.filter((f) => f !== field))
    }
  }

  // Clear all filters
  const clearAllFilters = () => {
    setFilters({
      clientId: "",
      clientName: "",
      serviceName: "",
      nppStatus: "",
    })
    setActiveFilters([])
    setSearchTerm("")
  }

  // Remove a specific filter
  const removeFilter = (field: string) => {
    setFilters((prev) => ({ ...prev, [field]: "" }))
    setActiveFilters((prev) => prev.filter((f) => f !== field))
  }

  const handleSaveService = (updatedService: any) => {
    setServices((prev) => prev.map((service) => (service.id === updatedService.id ? updatedService : service)))
  }

  const handleAddService = (newService: any) => {
    setServices((prev) => [...prev, newService])
  }

  const handleDeleteService = () => {
    if (serviceToDelete) {
      setServices((prev) => prev.filter((service) => service.id !== serviceToDelete))
      setServiceToDelete(null)
    }
  }

  const handleExport = (columns: string[], format: string) => {
    // In a real app, this would be an API call to generate the export
    console.log(`Exporting services with columns: ${columns.join(", ")} in format: ${format}`)
  }

  const filteredServices = services.filter((service) => {
    // Apply search term if present
    if (
      searchTerm &&
      !Object.values(service).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    // Apply specific filters
    if (filters.clientId && service.clientId !== filters.clientId) return false
    if (filters.clientName && service.clientName !== filters.clientName) return false
    if (filters.serviceName && service.serviceName !== filters.serviceName) return false
    if (filters.nppStatus) {
      const status = filters.nppStatus === "active" ? true : false
      if (service.nppStatus !== status) return false
    }

    return true
  })

  return (
    <div className="space-y-4">
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!serviceToDelete} onOpenChange={(open) => !open && setServiceToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Service</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this service? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteService} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search services..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2">
          <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[340px] p-0" align="end">
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-4 py-2">
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Filter Services</h3>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                        Clear all
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Client ID</label>
                          <Select value={filters.clientId} onValueChange={(value) => updateFilter("clientId", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select client ID" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Client IDs</SelectItem>
                              {clientIds.map((id) => (
                                <SelectItem key={id} value={id}>
                                  {id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Client Name</label>
                          <Select
                            value={filters.clientName}
                            onValueChange={(value) => updateFilter("clientName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select client name" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Clients</SelectItem>
                              {clientNames.map((name) => (
                                <SelectItem key={name} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Service Name</label>
                          <Select
                            value={filters.serviceName}
                            onValueChange={(value) => updateFilter("serviceName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select service name" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Services</SelectItem>
                              {serviceNames.map((name) => (
                                <SelectItem key={name} value={name}>
                                  {name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">NPP Status</label>
                          <Select value={filters.nppStatus} onValueChange={(value) => updateFilter("nppStatus", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select NPP status" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Statuses</SelectItem>
                              <SelectItem value="active">Active</SelectItem>
                              <SelectItem value="inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <Button onClick={() => setIsFilterOpen(false)} className="w-full">
                        Apply Filters
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>

          <NewServiceDialog onAdd={handleAddService} />
          <ExportServicesDialog onExport={handleExport} />
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="flex items-center gap-1 bg-primary/5">
              <span className="capitalize">{filter.replace(/([A-Z])/g, " $1").trim()}</span>:{" "}
              {filter === "nppStatus" ? (filters[filter] === "active" ? "Active" : "Inactive") : filters[filter]}
              <button onClick={() => removeFilter(filter)} className="ml-1 rounded-full hover:bg-gray-200 p-0.5">
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>ID</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Service</TableHead>
              <TableHead className="hidden md:table-cell">Rate</TableHead>
              <TableHead className="hidden md:table-cell">NPP Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredServices.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-gray-500">
                  No services found
                </TableCell>
              </TableRow>
            ) : (
              filteredServices.map((service) => (
                <>
                  <TableRow
                    key={service.id}
                    className="cursor-pointer hover:bg-gray-50"
                    onClick={() => toggleRow(service.id)}
                  >
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        {expandedRows[service.id] ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell className="font-medium">{service.id}</TableCell>
                    <TableCell>
                      <div>{service.clientName}</div>
                      <div className="text-xs text-gray-500">{service.clientId}</div>
                    </TableCell>
                    <TableCell>{service.serviceName}</TableCell>
                    <TableCell className="hidden md:table-cell">{service.rate}</TableCell>
                    <TableCell className="hidden md:table-cell">
                      {service.nppStatus ? (
                        <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">
                          <Check className="h-3 w-3 mr-1" /> Active
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-gray-50 text-gray-600 border-gray-200">
                          <X className="h-3 w-3 mr-1" /> Inactive
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                        <EditServiceDialog service={service} onSave={handleSaveService} />

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
                            <DropdownMenuItem
                              onClick={() => setExpandedRows((prev) => ({ ...prev, [service.id]: true }))}
                            >
                              <ChevronDown className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              <FileEdit className="mr-2 h-4 w-4" />
                              Edit Service
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {}}>
                              <Download className="mr-2 h-4 w-4" />
                              Export Details
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-red-600" onClick={() => setServiceToDelete(service.id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete Service
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                  {expandedRows[service.id] && (
                    <TableRow>
                      <TableCell colSpan={7} className="bg-gray-50 p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium mb-2">Service Details</h4>
                            <div className="space-y-2 text-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Service Name:</div>
                                <div>{service.serviceName}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Rate:</div>
                                <div>{service.rate}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">Minimum Charge:</div>
                                <div>{service.minimumCharge}</div>
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="text-gray-500">NPP Status:</div>
                                <div>{service.nppStatus ? "Active" : "Inactive"}</div>
                              </div>
                            </div>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Notes</h4>
                            <div className="text-sm">{service.notes}</div>
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

      {/* Results Count */}
      <div className="text-sm text-gray-500">
        Showing {filteredServices.length} of {services.length} services
      </div>
    </div>
  )
}
