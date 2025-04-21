import { AgreementsTable } from "@/components/agreements-table"

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
