import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { FileEdit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ServiceDetails {
  client_service_id: string;
  clientId: string;
  practiceName: string;
  services: {
    serviceName: string;
    rate: string;
    nppStatus: string;
  }[]; // Ensure services is an array of objects with these properties
  rate: string;
  minimum: string;
  nppStatus: string;
  notes: string;
}

interface EditServiceDialogProps {
  service: ServiceDetails;
  trigger?: React.ReactNode;
  onSave?: (service: ServiceDetails) => void;
}

export function EditServiceDialog({ service, trigger, onSave }: EditServiceDialogProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<ServiceDetails>({ ...service });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof ServiceDetails | "serviceName", value: string | boolean) => {
    if (field === "serviceName") {
      // Update the serviceName inside the services array
      setFormData((prev) => ({
        ...prev,
        services: [{ ...prev.services[0], serviceName: value as string }],
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };
  

  const handleSubmit = () => {
    setSaving(true);

    // In a real app, this would be an API call to update the service
    setTimeout(() => {
      if (onSave) {
        onSave(formData);
      }
      setSaving(false);
      setOpen(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <FileEdit className="mr-2 h-4 w-4" />
            Edit Service
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Service</DialogTitle>
          <DialogDescription>
            Update service details for {service.practiceName} (Client ID: {service.clientId})
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="serviceName">Service Name</Label>
            <Input
              id="serviceName"
              value={formData.services[0]?.serviceName} // Accessing serviceName inside services array
              onChange={(e) => handleChange("serviceName", e.target.value)}
              disabled
            />
            <p className="text-xs text-gray-500">Service name cannot be changed. Create a new service instead.</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="rate">Rate</Label>
            <Input
              id="rate"
              value={formData.rate}
              onChange={(e) => handleChange("rate", e.target.value)}
              placeholder="e.g., $25 per claim, 8% of collections"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="minimum">Minimum</Label>
            <Input
              id="minimum"
              value={formData.minimum}
              onChange={(e) => handleChange("minimum", e.target.value)}
              placeholder="e.g., $500 per month, N/A"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="nppStatus" className="cursor-pointer">
              NPP Status
            </Label>
            <Input
              id="nppStatus"
              value={formData.nppStatus}
              onChange={(e) => handleChange("nppStatus", e.target.value)}
              placeholder="Not Available"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              placeholder="Additional information about this service"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
