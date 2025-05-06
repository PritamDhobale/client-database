import { AgreementsTable } from "@/components/agreements-table"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function AgreementsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Agreements</h1>
      </div>

      <AgreementsTable />
    </div>
  )
}
