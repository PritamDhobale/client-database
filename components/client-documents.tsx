import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Download, FileText, FileImage, FileArchive, File } from "lucide-react"

interface Document {
  name: string
  type: string
  uploadedAt: string
  size: string
}

interface ClientDocumentsProps {
  clientId: string
  documents: Document[]
}

export function ClientDocuments({ clientId, documents }: ClientDocumentsProps) {
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

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No documents have been uploaded for this client yet.</p>
      </div>
    )
  }

  return (
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
        {documents.map((doc, index) => (
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
  )
}
