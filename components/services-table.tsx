"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  MoreHorizontal,
  ChevronDown,
  ChevronRight,
  Search,
  FileEdit,
  Download,
  Trash2,
  X,
  Filter,
  Check,
} from "lucide-react"
import React from "react";
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
import { supabase } from "@/lib/supabaseClient"
import { Separator } from "@radix-ui/react-dropdown-menu"


interface ServiceDetails {
  client_service_id: string;
  clientId: string;
  practiceName: string;
  services: {
    serviceName: string;
    rate: string;
    nppStatus: boolean;
    notes: string;
  }[];
  rate: string;
  minimum: string;
  nppStatus: boolean;
  notes: string;
}


export function ServicesTable() {
  const [services, setServices] = useState<ServiceDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({})
  const [filters, setFilters] = useState({
    clientId: "",
    practiceName: "",
    serviceName: [] as string[], // <- change this to array
    nppStatus: "",
  })
  
  const [activeFilters, setActiveFilters] = useState<string[]>([])

  useEffect(() => {
    const fetchServices = async () => {
      // Fetch the data from the client_services table
      const { data: clientServices, error: serviceError } = await supabase
        .from("client_services")
        .select(`
          client_service_id, 
          client_id, 
          id, 
          services(service_name), 
          rate, 
          minimum, 
          npp_status, 
          notes
        `);
    
      if (serviceError) {
        console.error("Error fetching services:", serviceError);
        return;
      }
    
      // Now fetch the practice_name from the Clients table using the client_id
      const clientIds = clientServices.map(service => service.client_id);
      const { data: clients, error: clientError } = await supabase
        .from("Clients")
        .select("client_id, practice_name")
        .in("client_id", clientIds);  // Use the in() method to fetch all clients that match the client_ids
    
      if (clientError) {
        console.error("Error fetching clients:", clientError);
        return;
      }
    
      // Map over the client_services data and add practice_name by matching client_id
      const formattedData = clientServices.map((service: any) => {
        const client = clients.find(client => client.client_id === service.client_id)
        return {
          client_service_id: service.client_service_id,
          clientId: service.client_id,
          practiceName: client ? client.practice_name : "Unknown",
          services: [{
            serviceName: service.services?.service_name || "Unknown",
            rate: service.rate,
            nppStatus: service.npp_status,
            notes: service.notes,
          }],          
          rate: service.rate,
          minimum: service.minimum,
          nppStatus: service.npp_status,
          notes: service.notes,
        };
      });
      
      
    
      // Update the state with the formatted data
      setServices(formattedData);
    };

    fetchServices();  // Call the function to fetch the data
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  // Group the services by clientId

const handleSaveService = (updatedService: any) => {
  setServices((prev) =>
    prev.map((service) => (service.client_service_id === updatedService.client_service_id ? updatedService : service))
  );
};

const updateFilter = (key: string, value: string | string[]) => {
  setFilters((prev) => ({ ...prev, [key]: value }));

  if (value && !activeFilters.includes(key)) {
    setActiveFilters((prev) => [...prev, key]);
  } else if (
    (Array.isArray(value) && value.length === 0) ||
    (!Array.isArray(value) && !value)
  ) {
    setActiveFilters((prev) => prev.filter((f) => f !== key));
  }
};



const filteredServices = services.filter((service) => {
  if (
    searchTerm &&
    !Object.values(service).some((value) =>
      String(value).toLowerCase().includes(searchTerm.toLowerCase())
    )
  ) {
    return false;
  }

  if (
    filters.clientId &&
    filters.clientId !== "all" &&
    service.clientId !== filters.clientId
  )
    return false;

  if (
    filters.practiceName &&
    filters.practiceName !== "all" &&
    service.practiceName !== filters.practiceName
  )
    return false;

  if (filters.nppStatus && filters.nppStatus !== "all") {
    const normalizedStatus = service.nppStatus?.toString().toLowerCase();
    const matchStatus = filters.nppStatus === "active" ? "true" : "false";
    if (normalizedStatus !== matchStatus) return false;
  }

  // 💡 NEW: Check if service name(s) appear anywhere for this client
  if (filters.serviceName.length > 0) {
    const allServicesForClient = services
      .filter((s) => s.clientId === service.clientId)
      .map((s) => s.services[0]?.serviceName);

    const hasAllSelectedServices = filters.serviceName.every((selected) =>
      allServicesForClient.includes(selected)
    );

    if (!hasAllSelectedServices) return false;
  }

  return true;
});

  
  // Group the filtered services by clientId
const groupedServices = filteredServices.reduce((acc: Record<string, any>, service: any) => {
  const client_id = service.clientId;

  if (!acc[client_id]) {
    acc[client_id] = {
      clientId: client_id,
      practiceName: service.practiceName || "Unknown",
      services: [],
    };
  }

  acc[client_id].services.push(service);

  return acc;
}, {});


  return (
    <div className="space-y-4">
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
              <Button
                variant="outline"
                onClick={() => setIsFilterOpen((prev) => !prev)} // Toggle visibility of filters
                className="flex items-center gap-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {activeFilters.length > 0 && (
                  <Badge variant="secondary" className="ml-1">
                    {activeFilters.length}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-[340px] p-0 max-h-[400px] overflow-y-auto" align="end">
              <Card>
                <CardContent className="p-3">
                  <div className="space-y-4 py-2">
                    {/* <div className="flex items-center justify-between">
                      <h3 className="font-medium">Filter Services</h3>
                    </div> */}
                    <div className="flex items-center justify-between">
                      <h3 className="font-medium">Filter Services</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setFilters({
                            clientId: "",
                            practiceName: "",
                            serviceName: [],
                            nppStatus: "",
                          });
                          setActiveFilters([]);
                        }}
                        className="h-8 px-2 text-xs"
                      >
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
                              {Array.from(new Set(services.map((s) => s.clientId))).map((id) => (
                                <SelectItem key={id} value={id}>
                                  {id}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Practice Name</label>
                          <Select
                            value={filters.practiceName}
                            onValueChange={(value) => updateFilter("practiceName", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select practice name" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Clients</SelectItem>
                              {Array.from(new Set(services.map((s) => s.practiceName)))
                                .map((name) => (
                                  <SelectItem key={name} value={name}>
                                    {name}
                                  </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium">Service Name</label>
                          <div className="border p-2 rounded max-h-40 overflow-y-auto">
                            {Array.from(new Set(
                              services.flatMap((s) => s.services.map((ss) => ss.serviceName))
                            ))
                              .slice(0, 10)
                              .map((name) => (
                                <div key={name} className="flex items-center space-x-2">
                                  <input
                                    type="checkbox"
                                    value={name}
                                    checked={filters.serviceName?.includes(name)}
                                    onChange={(e) => {
                                      const checked = e.target.checked;
                                      const updated = checked
                                        ? [...(filters.serviceName || []), name]
                                        : filters.serviceName.filter((n: string) => n !== name);
                                      updateFilter("serviceName", updated);
                                    }}
                                  />
                                  <label>{name}</label>
                                </div>
                              ))}
                          </div>
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

                    {/* <div className="pt-2 flex justify-end">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setFilters({
                          clientId: "",
                          practiceName: "",
                          serviceName: [], // ✅ Clear array, not string
                          nppStatus: "",
                        });
                        setActiveFilters([]);
                      }}
                    >
                      Clear All
                    </Button>
                      <Button onClick={() => setIsFilterOpen(false)} className="w-full">
                        Apply Filters
                      </Button>
                    </div> */}
                  </div>
                </CardContent>
              </Card>
            </PopoverContent>
          </Popover>

          {/* <NewServiceDialog onAdd={(newService) => setServices([...services, newService])} /> */}
          <ExportServicesDialog onExport={(columns, format) => console.log(`Exporting services with columns: ${columns}, format: ${format}`)} />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10"></TableHead>
              <TableHead>Client ID</TableHead>
              <TableHead>Practice Name</TableHead>
          
              <TableHead></TableHead>
              <TableHead>NPP Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
  {Object.values(groupedServices).map((clientData: any) => (
    <React.Fragment key={clientData.clientId}>
      <TableRow className="cursor-pointer hover:bg-gray-50">
        <TableCell>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => toggleRow(clientData.clientId)}>
            {expandedRows[clientData.clientId] ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </TableCell>
        <TableCell>{clientData.clientId}</TableCell>
        <TableCell>{clientData.practiceName}</TableCell>
        <TableCell></TableCell>
        <TableCell className="hidden md:table-cell">
          {clientData.services.map((service: any) => (
            <div key={service.client_service_id}>
              {service.nppStatus}
            </div>
          ))}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <EditServiceDialog service={clientData.services[0]} onSave={handleSaveService} />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {/* <Button variant="ghost" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button> */}
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <FileEdit className="mr-2 h-4 w-4" />
                  Edit Service
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Download className="mr-2 h-4 w-4" />
                  Export Details
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </TableCell>
      </TableRow>

      {expandedRows[clientData.clientId] && (
        <TableRow key={`${clientData.clientId}-expanded`}>
          <TableCell colSpan={7} className="bg-gray-50 p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Service Details</h4>
                <div className="space-y-2 text-sm">
                  {clientData.services.map((service: any) => (
                    <div key={service.client_service_id} className="grid grid-cols-2 gap-2">
                      <div className="text-gray-500">Service Name:</div>
                      <div>{service.services[0]?.serviceName || "Unknown"}</div>
                      <div className="text-gray-500">Rate:</div>
                      <div>{service.rate}</div>
                      <div className="text-gray-500">Minimum:</div>
                      <div>{service.minimum}</div>
                      <div className="text-gray-500">NPP Status:</div>
                      <div>{service.nppStatus}</div>
                      <div className="text-gray-500">Notes:</div>
                      <div>{service.notes}</div>
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
    </React.Fragment>
  ))}
</TableBody>



        </Table>
      </div>
    </div>
  )
}
