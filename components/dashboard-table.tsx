"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Search, ChevronDown, FileEdit, Trash2, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

const clients = [
  {
    id: "CL001",
    practiceName: "Sunshine Medical Group",
    primaryContact: "Dr. Sarah Johnson",
    email: "sjohnson@sunshinemedical.com",
    state: "CA",
    status: "active",
  },
  {
    id: "CL002",
    practiceName: "Westside Healthcare",
    primaryContact: "Dr. Michael Chen",
    email: "mchen@westsidehc.com",
    state: "NY",
    status: "active",
  },
  {
    id: "CL003",
    practiceName: "Northpark Physicians",
    primaryContact: "Dr. Robert Williams",
    email: "rwilliams@northparkphys.com",
    state: "TX",
    status: "active",
  },
  {
    id: "CL004",
    practiceName: "Eastside Medical Center",
    primaryContact: "Dr. Emily Rodriguez",
    email: "erodriguez@eastsidemc.com",
    state: "FL",
    status: "inactive",
  },
  {
    id: "CL005",
    practiceName: "Valley Health Partners",
    primaryContact: "Dr. James Smith",
    email: "jsmith@valleyhp.com",
    state: "AZ",
    status: "active",
  },
]

export function DashboardTable() {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredClients = clients.filter(
    (client) =>
      client.practiceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.primaryContact.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.id.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search clients..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button>
          View All
          <ChevronDown className="ml-2 h-4 w-4" />
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Practice Name</TableHead>
              <TableHead className="hidden md:table-cell">Primary Contact</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">State</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => (
              <TableRow key={client.id}>
                <TableCell className="font-medium">{client.id}</TableCell>
                <TableCell>{client.practiceName}</TableCell>
                <TableCell className="hidden md:table-cell">{client.primaryContact}</TableCell>
                <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                <TableCell className="hidden md:table-cell">{client.state}</TableCell>
                <TableCell>
                  <Badge variant={client.status === "active" ? "default" : "secondary"}>
                    {client.status === "active" ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
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
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <FileEdit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
