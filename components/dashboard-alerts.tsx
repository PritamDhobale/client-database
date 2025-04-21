import { AlertTriangle, Clock } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const alerts = [
  {
    id: 1,
    client: "Sunshine Medical Group",
    expiryDate: "2025-05-15",
    daysRemaining: 30,
  },
  {
    id: 2,
    client: "Westside Healthcare",
    expiryDate: "2025-05-05",
    daysRemaining: 20,
  },
  {
    id: 3,
    client: "Northpark Physicians",
    expiryDate: "2025-04-25",
    daysRemaining: 10,
  },
  {
    id: 4,
    client: "Eastside Medical Center",
    expiryDate: "2025-04-17",
    daysRemaining: 2,
  },
]

export function DashboardAlerts() {
  return (
    <div className="space-y-4">
      {alerts.length === 0 ? (
        <div className="text-center py-6 text-gray-500">No contract expiry alerts at this time</div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-md"
            >
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-3" />
                <div>
                  <h4 className="font-medium">{alert.client}</h4>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Expires: {new Date(alert.expiryDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <Badge
                variant={alert.daysRemaining <= 2 ? "destructive" : alert.daysRemaining <= 10 ? "outline" : "secondary"}
              >
                {alert.daysRemaining} days remaining
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
