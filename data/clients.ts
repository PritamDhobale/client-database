export interface Client {
  id: string
  practiceName: string
  primaryContact: string
  email: string
  phone: string
  state: string
  status: "active" | "inactive"
  category: string
  createdAt: string
  address: {
    street: string
    city: string
    zipCode: string
  }
  taxId: string
  npi: string
  billingInfo: {
    contactName: string
    contactEmail: string
    contactPhone: string
  }
  notes: string
  documents?: {
    name: string
    type: string
    uploadedAt: string
    size: string
  }[]
}

export const clients: Client[] = [
  {
    id: "CL001",
    practiceName: "Sunshine Medical Group",
    primaryContact: "Dr. Sarah Johnson",
    email: "sjohnson@sunshinemedical.com",
    phone: "(555) 123-4567",
    state: "CA",
    status: "active",
    category: "Primary Care",
    createdAt: "2023-05-15",
    address: {
      street: "123 Sunshine Blvd",
      city: "Los Angeles",
      zipCode: "90001",
    },
    taxId: "12-3456789",
    npi: "1234567890",
    billingInfo: {
      contactName: "Mark Wilson",
      contactEmail: "mwilson@sunshinemedical.com",
      contactPhone: "(555) 987-6543",
    },
    notes: "Multi-provider practice specializing in family medicine. Established relationship since 2020.",
    documents: [
      {
        name: "Contract_2023.pdf",
        type: "PDF",
        uploadedAt: "2023-01-10",
        size: "1.2 MB",
      },
      {
        name: "Provider_Credentials.zip",
        type: "ZIP",
        uploadedAt: "2023-02-15",
        size: "4.5 MB",
      },
    ],
  },
  {
    id: "CL002",
    practiceName: "Westside Healthcare",
    primaryContact: "Dr. Michael Chen",
    email: "mchen@westsidehc.com",
    phone: "(555) 234-5678",
    state: "NY",
    status: "active",
    category: "Specialty",
    createdAt: "2023-06-22",
    address: {
      street: "456 West Avenue",
      city: "New York",
      zipCode: "10001",
    },
    taxId: "23-4567890",
    npi: "2345678901",
    billingInfo: {
      contactName: "Jennifer Lee",
      contactEmail: "jlee@westsidehc.com",
      contactPhone: "(555) 876-5432",
    },
    notes: "Cardiology specialty practice with 5 providers. High-volume client.",
    documents: [
      {
        name: "Service_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-06-01",
        size: "950 KB",
      },
    ],
  },
  {
    id: "CL003",
    practiceName: "Northpark Physicians",
    primaryContact: "Dr. Robert Williams",
    email: "rwilliams@northparkphys.com",
    phone: "(555) 345-6789",
    state: "TX",
    status: "active",
    category: "Primary Care",
    createdAt: "2023-07-10",
    address: {
      street: "789 North Parkway",
      city: "Dallas",
      zipCode: "75001",
    },
    taxId: "34-5678901",
    npi: "3456789012",
    billingInfo: {
      contactName: "Susan Brown",
      contactEmail: "sbrown@northparkphys.com",
      contactPhone: "(555) 765-4321",
    },
    notes: "Family practice with 3 physicians and 2 nurse practitioners. Interested in expanding services.",
    documents: [
      {
        name: "Billing_Authorization.pdf",
        type: "PDF",
        uploadedAt: "2023-07-15",
        size: "1.1 MB",
      },
    ],
  },
  {
    id: "CL004",
    practiceName: "Eastside Medical Center",
    primaryContact: "Dr. Emily Rodriguez",
    email: "erodriguez@eastsidemc.com",
    phone: "(555) 456-7890",
    state: "FL",
    status: "inactive",
    category: "Hospital",
    createdAt: "2023-04-05",
    address: {
      street: "101 East Medical Drive",
      city: "Miami",
      zipCode: "33101",
    },
    taxId: "45-6789012",
    npi: "4567890123",
    billingInfo: {
      contactName: "David Thompson",
      contactEmail: "dthompson@eastsidemc.com",
      contactPhone: "(555) 654-3210",
    },
    notes: "Small community hospital. Contract on hold pending administrative review.",
    documents: [
      {
        name: "Initial_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-04-10",
        size: "1.5 MB",
      },
    ],
  },
  {
    id: "CL005",
    practiceName: "Valley Health Partners",
    primaryContact: "Dr. James Smith",
    email: "jsmith@valleyhp.com",
    phone: "(555) 567-8901",
    state: "AZ",
    status: "active",
    category: "Specialty",
    createdAt: "2023-08-18",
    address: {
      street: "222 Valley View Road",
      city: "Phoenix",
      zipCode: "85001",
    },
    taxId: "56-7890123",
    npi: "5678901234",
    billingInfo: {
      contactName: "Patricia Garcia",
      contactEmail: "pgarcia@valleyhp.com",
      contactPhone: "(555) 543-2109",
    },
    notes: "Orthopedic specialty group with 7 physicians. High-priority client.",
    documents: [
      {
        name: "Provider_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-08-20",
        size: "2.3 MB",
      },
      {
        name: "Credentialing_Docs.zip",
        type: "ZIP",
        uploadedAt: "2023-08-25",
        size: "7.8 MB",
      },
    ],
  },
  {
    id: "CL006",
    practiceName: "Metro Medical Associates",
    primaryContact: "Dr. Lisa Brown",
    email: "lbrown@metromedical.com",
    phone: "(555) 678-9012",
    state: "IL",
    status: "inactive",
    category: "Primary Care",
    createdAt: "2023-03-12",
    address: {
      street: "333 Metro Avenue",
      city: "Chicago",
      zipCode: "60601",
    },
    taxId: "67-8901234",
    npi: "6789012345",
    billingInfo: {
      contactName: "Richard Davis",
      contactEmail: "rdavis@metromedical.com",
      contactPhone: "(555) 432-1098",
    },
    notes: "Practice closed due to retirement of primary physician. Archive after final billing cycle.",
    documents: [
      {
        name: "Termination_Notice.pdf",
        type: "PDF",
        uploadedAt: "2023-09-01",
        size: "850 KB",
      },
    ],
  },
  {
    id: "CL007",
    practiceName: "Coastal Care Clinic",
    primaryContact: "Dr. David Kim",
    email: "dkim@coastalcare.com",
    phone: "(555) 789-0123",
    state: "CA",
    status: "active",
    category: "Specialty",
    createdAt: "2023-09-30",
    address: {
      street: "444 Coastal Highway",
      city: "San Diego",
      zipCode: "92101",
    },
    taxId: "78-9012345",
    npi: "7890123456",
    billingInfo: {
      contactName: "Michelle Park",
      contactEmail: "mpark@coastalcare.com",
      contactPhone: "(555) 321-0987",
    },
    notes: "Dermatology practice with 4 providers. New client with high growth potential.",
    documents: [
      {
        name: "Service_Contract.pdf",
        type: "PDF",
        uploadedAt: "2023-09-25",
        size: "1.7 MB",
      },
    ],
  },
  {
    id: "CL008",
    practiceName: "Mountain View Medical",
    primaryContact: "Dr. Jennifer Lee",
    email: "jlee@mountainviewmed.com",
    phone: "(555) 890-1234",
    state: "CO",
    status: "active",
    category: "Primary Care",
    createdAt: "2023-10-15",
    address: {
      street: "555 Mountain Road",
      city: "Denver",
      zipCode: "80201",
    },
    taxId: "89-0123456",
    npi: "8901234567",
    billingInfo: {
      contactName: "Thomas Wilson",
      contactEmail: "twilson@mountainviewmed.com",
      contactPhone: "(555) 210-9876",
    },
    notes: "Rural health clinic serving mountain communities. Special billing arrangements in place.",
    documents: [
      {
        name: "Rural_Health_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-10-20",
        size: "2.1 MB",
      },
    ],
  },
  {
    id: "CL009",
    practiceName: "Riverdale Health Services",
    primaryContact: "Dr. Thomas Wilson",
    email: "twilson@riverdalehealthservices.com",
    phone: "(555) 901-2345",
    state: "NY",
    status: "active",
    category: "Hospital",
    createdAt: "2023-11-05",
    address: {
      street: "666 River Street",
      city: "Albany",
      zipCode: "12201",
    },
    taxId: "90-1234567",
    npi: "9012345678",
    billingInfo: {
      contactName: "Elizabeth Clark",
      contactEmail: "eclark@riverdalehealthservices.com",
      contactPhone: "(555) 109-8765",
    },
    notes: "Medium-sized hospital with multiple departments. Complex billing structure.",
    documents: [
      {
        name: "Master_Service_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-11-10",
        size: "3.5 MB",
      },
      {
        name: "Department_Addendums.zip",
        type: "ZIP",
        uploadedAt: "2023-11-15",
        size: "8.2 MB",
      },
    ],
  },
  {
    id: "CL010",
    practiceName: "Lakeside Family Practice",
    primaryContact: "Dr. Maria Garcia",
    email: "mgarcia@lakesidefp.com",
    phone: "(555) 012-3456",
    state: "MI",
    status: "inactive",
    category: "Primary Care",
    createdAt: "2023-02-28",
    address: {
      street: "777 Lakeside Drive",
      city: "Detroit",
      zipCode: "48201",
    },
    taxId: "01-2345678",
    npi: "0123456789",
    billingInfo: {
      contactName: "Robert Johnson",
      contactEmail: "rjohnson@lakesidefp.com",
      contactPhone: "(555) 098-7654",
    },
    notes: "Practice temporarily closed for renovation. Expected to resume services in Q1 2024.",
    documents: [
      {
        name: "Suspension_Agreement.pdf",
        type: "PDF",
        uploadedAt: "2023-12-01",
        size: "1.3 MB",
      },
    ],
  },
]

export const getClientById = (id: string): Client | undefined => {
  return clients.find((client) => client.id === id)
}
