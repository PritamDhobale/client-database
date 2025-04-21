"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, Download, FileText, FileImage, FileArchive, File, Search, X } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Document {
  name: string
  type: string
  uploadedAt: string
  size: string
}

interface FileViewerDialogProps {
  clientId: string
  clientName: string
  documents: Document[]
  trigger?: React.ReactNode
}

export function FileViewerDialog({ clientId, clientName, documents, trigger }: FileViewerDialogProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Function to determine the icon based on document type
  const getDocumentIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-500" />
      case "jpg":
      case "jpeg":
      case "png":
        return <FileImage className="h-4 w-4 text-blue-500" />
      case "zip":
        return <FileArchive className="h-4 w-4 text-yellow-500" />
      default:
        return <File className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredDocuments = documents.filter((doc) => doc.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Eye className="mr-2 h-4 w-4" />
            View Files
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Client Documents</DialogTitle>
          <DialogDescription>
            Documents for {clientName} (Client ID: {clientId})
          </DialogDescription>
        </DialogHeader>

        <div className="relative my-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            placeholder="Search documents..."
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

        {documents.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No documents have been uploaded for this client yet.</p>
          </div>
        ) : filteredDocuments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No documents match your search.</p>
          </div>
        ) : (
          <ScrollArea className="h-[300px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Uploaded</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDocuments.map((doc, index) => (
                  <TableRow key={index}>
                    <TableCell className="flex items-center">
                      {getDocumentIcon(doc.type)}
                      <span className="ml-2">{doc.name}</span>
                    </TableCell>
                    <TableCell>{doc.type}</TableCell>
                    <TableCell>{new Date(doc.uploadedAt).toLocaleDateString()}</TableCell>
                    <TableCell>{doc.size}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-1" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}
