import { ServicesTable } from "@/components/services-table"
import { supabase } from "@/lib/supabaseClient"

export default function ServicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Services</h1>
      </div>

      <ServicesTable />
    </div>
  )
}
