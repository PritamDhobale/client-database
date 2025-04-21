"use client"

import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Search, FileEdit, Trash2, Eye, RefreshCw, Download, Filter, X } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { FileViewerDialog } from "@/components/file-viewer-dialog"

// Mock data - moved to a separate file for reuse
// import { clients } from "@/data/clients"
import { supabase } from "@/lib/supabaseClient"
import { useEffect, useState } from "react"


// Get unique values for filter options
const getUniqueValues = (field: string, data: any[]) => {
  const values = [...new Set(data.map((client) => client[field]))]
  return values.filter(Boolean).sort()
}


interface ClientsTableProps {
  status: "active" | "inactive"
}

interface FilterState {
  client_id: string
  practice_name: string
  primary_contact: string
  email: string
  state: string
  category: string
}

export function ClientsTable({ status }: ClientsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filters, setFilters] = useState<FilterState>({
    client_id: "",
    practice_name: "",
    primary_contact: "",
    email: "",
    state: "",
    category: "",
  })
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [clientToArchive, setClientToArchive] = useState<string | null>(null)
  const [clientToRestore, setClientToRestore] = useState<string | null>(null)

  const [clients, setClients] = useState<any[]>([])

useEffect(() => {
  const fetchClients = async () => {
    const { data, error } = await supabase.from("Clients").select("*")
    if (error) {
      console.error("Error fetching clients:", error)
    } else {
      setClients(data)
    }
  }

  fetchClients()
}, [])


  // Get unique values for dropdowns
  const states = getUniqueValues("state", clients)
  const categories = getUniqueValues("category", clients)


  // Update filter
  const updateFilter = (field: keyof FilterState, value: string) => {
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
      client_id: "",
      practice_name: "",
      primary_contact: "",
      email: "",
      state: "",
      category: "",
    })
    setActiveFilters([])
    setSearchTerm("")
  }

  // Remove a specific filter
  const removeFilter = (field: keyof FilterState) => {
    setFilters((prev) => ({ ...prev, [field]: "" }))
    setActiveFilters((prev) => prev.filter((f) => f !== field))
  }

  // Navigate to client detail page
  const handleRowClick = (clientId: string) => {
    router.push(`/clients/${clientId}`)
  }

  // Handle archive client
  const handleArchiveClient = () => {
    // In a real app, this would be an API call to archive the client
    console.log(`Archiving client ${clientToArchive}`)
    setClientToArchive(null)
    // After successful archive, you would refresh the client list
  }

  // Handle restore client
  const handleRestoreClient = () => {
    // In a real app, this would be an API call to restore the client
    console.log(`Restoring client ${clientToRestore}`)
    setClientToRestore(null)
    // After successful restore, you would refresh the client list
  }

  // Apply filters to clients
  const filteredClients = clients.filter((client) => {
    // First filter by active/inactive status
    if (client.status !== status) return false

    // Then apply search term if present
    if (
      searchTerm &&
      !Object.values(client).some((value) => String(value).toLowerCase().includes(searchTerm.toLowerCase()))
    ) {
      return false
    }

    // Then apply specific filters
    if (filters.client_id && !client.client_id.toLowerCase().includes(filters.client_id.toLowerCase())) return false
    if (filters.practice_name && !client.practice_name.toLowerCase().includes(filters.practice_name.toLowerCase()))
      return false
    if (filters.primary_contact && !client.primary_contact.toLowerCase().includes(filters.primary_contact.toLowerCase()))
      return false
    if (filters.email && !client.email.toLowerCase().includes(filters.email.toLowerCase())) return false
    if (filters.state && client.state !== filters.state) return false
    if (filters.category && client.category !== filters.category) return false

    return true
  })

  return (
    <div className="space-y-4">
      {/* Archive Confirmation Dialog */}
      <AlertDialog open={!!clientToArchive} onOpenChange={(open) => !open && setClientToArchive(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Archive Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to archive this client? The client will be marked as inactive but all data will be
              preserved.
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
      <AlertDialog open={!!clientToRestore} onOpenChange={(open) => !open && setClientToRestore(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Restore Client</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this client? The client will be marked as active again.
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

      {/* Search and Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="relative w-full sm:max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search all fields..."
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
                      <h3 className="font-medium">Filter Clients</h3>
                      <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-8 px-2 text-xs">
                        Clear all
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Client ID</label>
                          <Input
                            placeholder="Filter by ID"
                            value={filters.client_id}
                            onChange={(e) => updateFilter("client_id", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Practice Name</label>
                          <Input
                            placeholder="Filter by practice name"
                            value={filters.practice_name}
                            onChange={(e) => updateFilter("practice_name", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Primary Contact</label>
                          <Input
                            placeholder="Filter by primary contact"
                            value={filters.primary_contact}
                            onChange={(e) => updateFilter("primary_contact", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Email</label>
                          <Input
                            placeholder="Filter by email"
                            value={filters.email}
                            onChange={(e) => updateFilter("email", e.target.value)}
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">State</label>
                          <Select value={filters.state} onValueChange={(value) => updateFilter("state", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All States</SelectItem>
                              {states.map((state) => (
                                <SelectItem key={state} value={state}>
                                  {state}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Categories</SelectItem>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
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

          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Active Filters Display */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-gray-500">Active filters:</span>
          {activeFilters.map((filter) => (
            <Badge key={filter} variant="outline" className="flex items-center gap-1 bg-primary/5">
              <span className="capitalize">{filter.replace(/([A-Z])/g, " $1").trim()}</span>:{" "}
              {filters[filter as keyof FilterState]}
              <button
                onClick={() => removeFilter(filter as keyof FilterState)}
                className="ml-1 rounded-full hover:bg-gray-200 p-0.5"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          <Button variant="ghost" size="sm" onClick={clearAllFilters} className="h-7 px-2 text-xs">
            Clear all
          </Button>
        </div>
      )}

      {/* Clients Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Practice Name</TableHead>
              <TableHead className="hidden md:table-cell">Primary Contact</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Phone</TableHead>
              <TableHead className="hidden md:table-cell">State</TableHead>
              <TableHead className="hidden md:table-cell">Category</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                  No clients found
                </TableCell>
              </TableRow>
            ) : (
              filteredClients.map((client) => (
                <TableRow
                  key={client.client_id}
                  className="cursor-pointer hover:bg-gray-50"
                  onClick={() => handleRowClick(client.client_id)}
                >
                  <TableCell className="font-medium">{client.client_id}</TableCell>
                  <TableCell>{client.practice_name}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.primary_contact}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.phone}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.state}</TableCell>
                  <TableCell className="hidden md:table-cell">{client.category}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                      <FileUploadDialog clientId={client.client_id} clientName={client.practice_name} />

                      <FileViewerDialog
                        clientId={client.client_id}
                        clientName={client.practice_name}
                        documents={client.documents || []}
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
                          <DropdownMenuItem onClick={() => router.push(`/clients/${client.client_id}`)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => router.push(`/clients/${client.client_id}/edit`)}>
                            <FileEdit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          {status === "active" ? (
                            <DropdownMenuItem className="text-red-600" onClick={() => setClientToArchive(client.client_id)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem className="text-green-600" onClick={() => setClientToRestore(client.client_id)}>
                              <RefreshCw className="mr-2 h-4 w-4" />
                              Restore
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-500">
      Showing {filteredClients.length} of {clients.filter((c) => c.status === status).length} clients
      </div>
    </div>
  )
}
