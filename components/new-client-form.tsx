"use client"

import { useState, useEffect } from "react"; // Add useEffect here
import { supabase } from "@/lib/supabaseClient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { PlusCircle } from "lucide-react"

interface Client {
  practice_name: "",
    dba: "",
    code: "",
    client_status: "",
    sla_number: "",
    primary_contact_title: "",
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    email: "",
    admin_contact_first_name: "",
    admin_contact_last_name: "",
    admin_contact_phone: "",
    admin_contact_title: "",
    admin_contact_email: "",
    authorized_rep_first_name: "",
    authorized_rep_last_name: "",
    authorized_rep_phone: "",
    authorized_rep_title: "",
    authorized_rep_email: "",
    city: "",
    state: "",
    state_of_formation: "",
    category_id: "",
    street_address: "",
    current_ehr: "",
    type_of_entity: "",
    website: "",
    zip: "",
    agreement_date: "",
    commencement_date: "",
    term: "",
    service_name: "",
    id: "",
    service_id: []; // This is important
    }

// List of US states for the dropdown
const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
]

// List of categories
const CATEGORIES = ["Primary Care", "Specialty", "Hospital", "Other"]

export function NewClientForm() {
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState<Client[]>([]);
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    practice_name: "",
    dba: "",
    code: "",
    client_status: "",
    sla_number: "",
    primary_contact_title: "",
    primary_contact_first_name: "",
    primary_contact_last_name: "",
    primary_contact_email: "",
    primary_contact_phone: "",
    email: "",
    admin_contact_first_name: "",
    admin_contact_last_name: "",
    admin_contact_phone: "",
    admin_contact_title: "",
    admin_contact_email: "",
    authorized_rep_first_name: "",
    authorized_rep_last_name: "",
    authorized_rep_phone: "",
    authorized_rep_credential: "",
    authorized_rep_title: "",
    authorized_rep_email: "",
    city: "",
    state: "",
    state_of_formation: "",
    category_id: "",
    street_address: "",
    current_ehr: "",
    type_of_entity: "",
    website: "",
    zip: "",
    agreement_date: "",
    commencement_date: "",
    term: "",
    service_ids: [] as string[],
  // Ensure services is typed as an array of strings (string[])
  })
  
  const handleChange = (field: string, value: any) => {
    setFormData({
      ...formData,
      [field]: value,  // Directly update the field with the selected value
    });
  };

  const [documents, setDocuments] = useState<File[]>([])

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setDocuments(Array.from(e.target.files));
    }
  }

  useEffect(() => {
    const fetchServices = async () => {
      const { data, error } = await supabase.from("services").select("*");
      if (data) {
        setServices(data);
  
        // ✅ Re-map selected services after loading list
        setFormData((prev) => ({
          ...prev,
          service_ids: prev.service_ids.filter(id =>
            data.some((service) => service.id === id)
          ),
        }));
      } else {
        console.error("Failed to fetch services:", error);
      }
    };
    fetchServices();
  }, []);
  

  // const handleSubmit = async () => {
    
  //   setSaving(true);
  //   try {
  //     const {
  //       agreement_date,
  //       commencement_date,
  //       term,
  //       service_ids,
  //       ...clientData
  //     } = formData;
  
  //     const payload = {
  //       ...clientData,
  //       zip: Number(formData.zip || 0),
  //       created_at: new Date().toISOString(),
  //     };

  //     const requiredFields = [
  //       "practice_name", "primary_contact_first_name", "primary_contact_last_name",
  //       "primary_contact_email", "primary_contact_phone"
  //     ];
      
  //     const missing = requiredFields.filter(field => !formData[field]);
  //     if (missing.length > 0) {
  //       alert(`Please fill in the required fields: ${missing.join(", ")}`);
  //       setSaving(false);
  //       return;
  //     }
      
  
  //     const { data, error } = await supabase
  //       .from("Clients")
  //       .insert([payload])
  //       .select("*");
  
  //     if (error) {
  //       console.error("Failed to add client:", error);
  //       return;
  //     }
  
  //     const clientId = data[0].client_id;
  
  //     // ✅ Log notification
  //     await supabase.from("notifications").insert([
  //       {
  //         message: `New client added: ${formData.practice_name}`,
  //         type: "client",
  //         created_at: new Date().toISOString(),
  //       },
  //     ]);
  
  //     // ✅ Log history
  //     await supabase.from("history").insert([
  //       {
  //         action: "add",
  //         entity: "client",
  //         description: `Client ${formData.practice_name} added.`,
  //         timestamp: new Date().toISOString(),
  //       },
  //     ]);
  
  //     if (documents.length > 0) {
  //       for (const doc of documents) {
  //         const filePath = `${clientId}/${encodeURIComponent(doc.name)}`;
  
  //         const { error: uploadError } = await supabase.storage
  //         .from("client-documents") // ✅ correct bucket name
  //         .upload(filePath, doc);
  
  //         if (uploadError) {
  //           console.error("Upload failed:", uploadError);
  //           continue;
  //         }
  
  //         // const {
  //         //   data: { publicUrl },
  //         // } = supabase.storage.from("client_documents").getPublicUrl(filePath);
  
  //         // const { error: insertError } = await supabase.from("client_documents").insert([
  //         //   {
  //         //     client_id: clientId,
  //         //     file_name: doc.name,
  //         //     file_url: publicUrl,
  //         //     size: doc.size,
  //         //   },
  //         // ]);
  //         const { error: insertError } = await supabase.from("client_documents").insert([
  //           {
  //             client_id: clientId,
  //             file_name: doc.name,
  //             file_url: filePath, // ✅ save path only
  //             size: doc.size,
  //           },
  //         ]);          
  
  //         if (insertError) {
  //           console.error("Failed to insert file record:", insertError);
  //         }
  //       }
  //     }
  
  //     const agreementPayload = {
  //       client_id: clientId,
  //       agreement_date,
  //       commencement_date,
  //       term,
  //       created_at: new Date().toISOString(),
  //     };
  
  //     const { error: agreementError } = await supabase
  //       .from("agreements")
  //       .insert([agreementPayload]);
  
  //     if (agreementError) {
  //       console.error("Failed to add agreement:", agreementError);
  //       return;
  //     }
  
  //     const servicesToAdd = service_ids.map((serviceId: string) => ({
  //       client_id: clientId,
  //       id: serviceId,
  //     }));
  
  //     const { error: serviceError } = await supabase
  //       .from("client_services")
  //       .upsert(servicesToAdd);
  
  //     if (serviceError) {
  //       console.error("Failed to add services:", serviceError);
  //     }
  
  //     setOpen(false);
  //     setFormData({
  //       practice_name: "",
  //       dba: "",
  //       code: "",
  //       client_status: "",
  //       sla_number: "",
  //       primary_contact_title: "",
  //       primary_contact_first_name: "",
  //       primary_contact_last_name: "",
  //       primary_contact_email: "",
  //       primary_contact_phone: "",
  //       email: "",
  //       admin_contact_first_name: "",
  //       admin_contact_last_name: "",
  //       admin_contact_phone: "",
  //       admin_contact_title: "",
  //       admin_contact_email: "",
  //       authorized_rep_first_name: "",
  //       authorized_rep_last_name: "",
  //       authorized_rep_phone: "",
  //       authorized_rep_credential: "",
  //       authorized_rep_title: "",
  //       authorized_rep_email: "",
  //       city: "",
  //       state: "",
  //       state_of_formation: "",
  //       category_id: "",
  //       street_address: "",
  //       current_ehr: "",
  //       type_of_entity: "",
  //       website: "",
  //       zip: "",
  //       agreement_date: "",
  //       commencement_date: "",
  //       term: "",
  //       service_ids: [],
  //     });
  //   } catch (err) {
  //     console.error("Unexpected error while adding client:", err);
  //   } finally {
  //     setSaving(false);
  //   }
  // };

  const handleSubmit = async () => {
    setSaving(true);
  
    // Step 1: Validate required fields first
    const requiredFields = [
      "practice_name",
      "primary_contact_first_name",
      "primary_contact_last_name",
      "primary_contact_email",
      "primary_contact_phone",
    ];
  
    const missing = requiredFields.filter(
      (field) => !(formData as Record<string, any>)[field]
    );
    
    if (missing.length > 0) {
      alert(`Please fill in the required fields: ${missing.join(", ")}`);
      setSaving(false);
      return;
    }
    
  
    try {
      const {
        agreement_date,
        commencement_date,
        term,
        service_ids,
        ...clientData
      } = formData;
  
      // Step 2: Sanitize numeric fields
      const payload = {
        ...clientData,
        zip: formData.zip !== "" ? Number(formData.zip) : null,
        category_id: formData.category_id !== "" ? Number(formData.category_id) : null,
        created_at: new Date().toISOString(),
      };
  
      // Step 3: Insert client
      const { data, error } = await supabase
        .from("Clients")
        .insert([payload])
        .select("*");
  
      if (error) {
        console.error("Failed to add client:", error);
        return;
      }
  
      const clientId = data[0].client_id;
  
      // Step 4: Log notification
      await supabase.from("notifications").insert([
        {
          message: `New client added: ${formData.practice_name}`,
          type: "client",
          created_at: new Date().toISOString(),
        },
      ]);
  
      // Step 5: Log history
      await supabase.from("history").insert([
        {
          action: "add",
          entity: "client",
          description: `Client ${formData.practice_name} added.`,
          timestamp: new Date().toISOString(),
        },
      ]);
  
      // Step 6: Handle document uploads
      if (documents.length > 0) {
        for (const doc of documents) {
          const filePath = `${clientId}/${encodeURIComponent(doc.name)}`;
          const { error: uploadError } = await supabase.storage
            .from("client-documents")
            .upload(filePath, doc);
  
          if (uploadError) {
            console.error("Upload failed:", uploadError);
            continue;
          }
  
          const { error: insertError } = await supabase
            .from("client_documents")
            .insert([
              {
                client_id: clientId,
                file_name: doc.name,
                file_url: filePath,
                size: doc.size,
              },
            ]);
  
          if (insertError) {
            console.error("Failed to insert file record:", insertError);
          }
        }
      }
  
      // Step 7: Insert agreement
      const agreementPayload = {
        client_id: clientId,
        agreement_date,
        commencement_date,
        term,
        created_at: new Date().toISOString(),
      };
  
      const { error: agreementError } = await supabase
        .from("agreements")
        .insert([agreementPayload]);
  
      if (agreementError) {
        console.error("Failed to add agreement:", agreementError);
        return;
      }
  
      // Step 8: Link services
      const servicesToAdd = service_ids.map((serviceId: string) => ({
        client_id: clientId,
        id: serviceId,
      }));
  
      const { error: serviceError } = await supabase
        .from("client_services")
        .upsert(servicesToAdd);
  
      if (serviceError) {
        console.error("Failed to add services:", serviceError);
      }
  
      // Step 9: Reset form
      setOpen(false);
      setFormData({
        practice_name: "",
        dba: "",
        code: "",
        client_status: "",
        sla_number: "",
        primary_contact_title: "",
        primary_contact_first_name: "",
        primary_contact_last_name: "",
        primary_contact_email: "",
        primary_contact_phone: "",
        email: "",
        admin_contact_first_name: "",
        admin_contact_last_name: "",
        admin_contact_phone: "",
        admin_contact_title: "",
        admin_contact_email: "",
        authorized_rep_first_name: "",
        authorized_rep_last_name: "",
        authorized_rep_phone: "",
        authorized_rep_credential: "",
        authorized_rep_title: "",
        authorized_rep_email: "",
        city: "",
        state: "",
        state_of_formation: "",
        category_id: "",
        street_address: "",
        current_ehr: "",
        type_of_entity: "",
        website: "",
        zip: "",
        agreement_date: "",
        commencement_date: "",
        term: "",
        service_ids: [],
      });
      setDocuments([]);
    } catch (err) {
      console.error("Unexpected error while adding client:", err);
    } finally {
      setSaving(false);
    }
  };
  
    
  // Download CSV template with headers only
const downloadTemplate = () => {
  const headers = Object.keys(formData).join(",");
  const csvContent = `${headers}\n`; // Just headers
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.setAttribute("download", "new_client_template.csv");
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Upload CSV and auto-populate form
const handleUploadCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    const csv = event.target?.result as string;
    const [headerLine, valueLine] = csv.split("\n");
    const headers = headerLine.split(",").map(h => h.trim());
    const values = valueLine.split(",").map(v => v.trim());

    const parsed: any = {};
    headers.forEach((key, i) => {
      if (key === "service_ids") {
        parsed[key] = values[i]?.split(";").map((id) => id.trim());
      } else if (key === "agreement_date" || key === "commencement_date") {
        const date = new Date(values[i]);
        if (!isNaN(date.getTime())) {
          parsed[key] = date.toISOString().split("T")[0]; // format: yyyy-mm-dd
        } else {
          parsed[key] = "";
        }
      } else {
        parsed[key] = values[i];
      }
    });

    setFormData((prev) => ({
      ...prev,
      ...parsed,
    }));
  };
  reader.readAsText(file);
};



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Client
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Client</DialogTitle>
          <DialogDescription>Enter the client details below to create a new client record.</DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-4 pb-2">
  <Button
    onClick={downloadTemplate}
    className="bg-[#8bc53d] hover:bg-[#79b231] text-white font-semibold shadow-md"
  >
    Download Client Form Template
  </Button>

  <label className="cursor-pointer bg-[#8bc53d] hover:bg-[#79b231] text-white font-semibold shadow-md px-4 py-2 rounded text-sm flex items-center justify-center">
    Upload Client Form
    <Input
      type="file"
      accept=".csv"
      onChange={handleUploadCSV}
      className="hidden"
    />
  </label>
</div>



        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>

            <div className="space-y-2">
              <Label htmlFor="practice_name">Practice Name *</Label>
              <Input
                id="practice_name"
                value={formData.practice_name}
                onChange={(e) => handleChange("practice_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_first_name">Primary Contact First Name *</Label>
              <Input
                id="primary_contact_first_name"
                value={formData.primary_contact_first_name}
                onChange={(e) => handleChange("primary_contact_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_last_name">Primary Contact Last Name *</Label>
              <Input
                id="primary_contact_last_name"
                value={formData.primary_contact_last_name}
                onChange={(e) => handleChange("primary_contact_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_title">Primary Contact Title *</Label>
              <Input
                id="primary_contact_title"
                value={formData.primary_contact_title}
                onChange={(e) => handleChange("primary_contact_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_email">Primary Contact Email *</Label>
              <Input
                id="primary_contact_email"
                value={formData.primary_contact_email}
                onChange={(e) => handleChange("primary_contact_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="primary_contact_phone">Primary Contact Phone *</Label>
              <Input
                id="primary_contact_phone"
                value={formData.primary_contact_phone}
                onChange={(e) => handleChange("primary_contact_phone", e.target.value)}
                required
              />
            </div>
            <Separator />
            <div className="space-y-2">
              <Label htmlFor="admin_contact_first_name">Admin Contact First Name *</Label>
              <Input
                id="admin_contact_first_name"
                value={formData.admin_contact_first_name}
                onChange={(e) => handleChange("admin_contact_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_last_name">Admin Contact Last Name *</Label>
              <Input
                id="admin_contact_last_name"
                value={formData.admin_contact_last_name}
                onChange={(e) => handleChange("admin_contact_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_title">Admin Contact Title *</Label>
              <Input
                id="admin_contact_title"
                value={formData.admin_contact_title}
                onChange={(e) => handleChange("admin_contact_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_email">Admin Contact Email *</Label>
              <Input
                id="admin_contact_email"
                value={formData.admin_contact_email}
                onChange={(e) => handleChange("admin_contact_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="admin_contact_phone">Admin Contact Phone *</Label>
              <Input
                id="admin_contact_phone"
                value={formData.admin_contact_phone}
                onChange={(e) => handleChange("admin_contact_phone", e.target.value)}
                required
              />
            </div>
            <Separator />
            <div className="flex items-center space-x-2">
  <input
    type="checkbox"
    id="same-as-primary"
    onChange={(e) => {
      if (e.target.checked) {
        setFormData((prev) => ({
          ...prev,
          authorized_rep_first_name: prev.primary_contact_first_name,
          authorized_rep_last_name: prev.primary_contact_last_name,
          authorized_rep_email: prev.primary_contact_email,
          authorized_rep_phone: prev.primary_contact_phone,
          authorized_rep_credential: prev.primary_contact_title,
        }))
      }
    }}
  />
  <label htmlFor="same-as-primary" className="text-sm font-medium">Same as Primary Contact</label>
</div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_first_name">Authorized Contact First Name *</Label>
              <Input
                id="authorized_rep_first_name"
                value={formData.authorized_rep_first_name}
                onChange={(e) => handleChange("authorized_rep_first_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_last_name">Authorized Contact Last Name *</Label>
              <Input
                id="authorized_rep_last_name"
                value={formData.authorized_rep_last_name}
                onChange={(e) => handleChange("authorized_rep_last_name", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_credential">Authorized Contact Credential *</Label>
              <Input
                id="authorized_rep_credential"
                value={formData.authorized_rep_credential}
                onChange={(e) => handleChange("authorized_rep_credential", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_title">Authorized Contact Title *</Label>
              <Input
                id="authorized_rep_title"
                value={formData.authorized_rep_title}
                onChange={(e) => handleChange("authorized_rep_title", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_email">Authorized Contact Email *</Label>
              <Input
                id="authorized_rep_email"
                value={formData.authorized_rep_email}
                onChange={(e) => handleChange("authorized_rep_email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="authorized_rep_phone">Authorized Contact Phone *</Label>
              <Input
                id="authorized_rep_phone"
                value={formData.authorized_rep_phone}
                onChange={(e) => handleChange("authorized_rep_phone", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dba">DBA</Label>
              <Input
                id="dba"
                value={formData.dba}
                onChange={(e) => handleChange("dba", e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
  <Label htmlFor="category_id">Category</Label>
  <Select
    value={formData.category_id}
    onValueChange={(value) => handleChange("category_id", value)}
  >
    <SelectTrigger id="category_id">
      <SelectValue placeholder="Select category" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="1">INDEPENDENT PRACTICES: Direct House</SelectItem>
      <SelectItem value="2">INDEPENDENT PRACTICES: Channel Partner</SelectItem>
      <SelectItem value="3">CORPORATE PRACTICES: House Account</SelectItem>
      <SelectItem value="4">CORPORATE ADVISORY</SelectItem>
    </SelectContent>
  </Select>
</div>
        

            <Separator />

            <div className="space-y-2">
              <Label htmlFor="street">Street Address</Label>
              <Input id="street" value={formData.street_address} onChange={(e) => handleChange("street_address", e.target.value)} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input id="city" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} />
              </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="current_ehr">Current EHR</Label>
                <Input id="current_ehr" value={formData.current_ehr} onChange={(e) => handleChange("current_ehr", e.target.value)} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Select value={formData.state} onValueChange={(value) => handleChange("state", value)}>
                    <SelectTrigger id="state">
                      <SelectValue placeholder="Select state" />
                    </SelectTrigger>
                    <SelectContent>
                      {US_STATES.map((state) => (
                        <SelectItem key={state} value={state}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="state_of_formation">State of Formation *</Label>
                <Select value={formData.state_of_formation} onValueChange={(value) => handleChange("state_of_formation", value)}>
                <SelectTrigger id="state_of_formation">
                  <SelectValue placeholder="Select state of formation" />
                </SelectTrigger>
                <SelectContent>
                  {US_STATES.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              </div>
              <div className="space-y-2">
              <Label htmlFor="zip">Zip Code</Label>
              <Input id="zip" value={formData.zip} onChange={(e) => handleChange("zip", e.target.value)} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="agreement_date">Agreement Date</Label>
                <Input
                  id="agreement_date"
                  type="date"
                  value={formData.agreement_date}
                  onChange={(e) => handleChange("agreement_date", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <Label htmlFor="commencement_date">Commencement Date</Label>
                <Input
                  id="commencement_date"
                  type="date"
                  value={formData.commencement_date}
                  onChange={(e) => handleChange("commencement_date", e.target.value)}
                />
            </div>
            <div className="space-y-2">
  <Label htmlFor="term">Term</Label>
  <Select value={formData.term} onValueChange={(value) => handleChange("term", value)}>
    <SelectTrigger id="term">
      <SelectValue placeholder="Select term" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="6 Month">6 Month</SelectItem>
      <SelectItem value="1 Year">1 Year</SelectItem>
      <SelectItem value="2 Years">2 Years</SelectItem>
      <SelectItem value="3 Years">3 Years</SelectItem>
      <SelectItem value="4 Years">4 Years</SelectItem>
      <SelectItem value="5 Years">5 Years</SelectItem>
    </SelectContent>
  </Select>
</div>

            <div className="space-y-2">
  <Label htmlFor="services">Services</Label>
  <div className="border rounded-md p-2">
    {services.map((service) => (
      <div key={service.id} className="flex items-center space-x-2">
        <input
          type="checkbox"
          id={`service-${service.id}`}
          value={service.id}
          checked={formData.service_ids.includes(service.id)}
          onChange={(e) => {
            const newIds = e.target.checked
              ? [...formData.service_ids, service.id]
              : formData.service_ids.filter((id) => id !== service.id);
            handleChange("service_ids", newIds);
          }}
        />
        <label htmlFor={`service-${service.id}`}>{service.service_name}</label>
      </div>
    ))}
  </div>
</div>
<div className="space-y-2">
              <Label htmlFor="code">Code</Label>
              <Input id="code" value={formData.code} onChange={(e) => handleChange("code", e.target.value)} />
            </div>

            <div className="space-y-2">
  <Label htmlFor="client_status">Status</Label>
  <Select value={formData.client_status} onValueChange={(value) => handleChange("client_status", value)}>
    <SelectTrigger id="client_status">
      <SelectValue placeholder="Select status" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="active">Active</SelectItem>
      <SelectItem value="inactive">Inactive</SelectItem>
    </SelectContent>
  </Select>
</div>


            <div className="space-y-2">
              <Label htmlFor="sla_number">SLA Number</Label>
              <Input id="sla_number" value={formData.sla_number} onChange={(e) => handleChange("sla_number", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type_of_entity">Type of Entity</Label>
              <Input id="type_of_entity" value={formData.type_of_entity} onChange={(e) => handleChange("type_of_entity", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label>Upload Documents</Label>
              <Input type="file" multiple onChange={handleDocumentUpload} />
            </div>
            </div>

            
            
          </div>

            <Separator />

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Creating..." : "Create Client"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
