"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserCheck, UserX, FileText, Settings, AlertTriangle } from "lucide-react"
import { useRouter } from "next/navigation"  // Importing useRouter for navigation
import { supabase } from "@/lib/supabaseClient"
import { DashboardChart } from "@/components/dashboard-chart"
import { DashboardTable } from "@/components/dashboard-table"
import { DashboardAlerts } from "@/components/dashboard-alerts"
import { useAuthGuard } from "@/hooks/useAuthGuard"

export default function Dashboard() {
  const [totalClients, setTotalClients] = useState(0)
  const [activeClients, setActiveClients] = useState(0)
  const [inactiveClients, setInactiveClients] = useState(0)
  const [totalServices, setTotalServices] = useState(0)
  const [totalAgreements, setTotalAgreements] = useState(0)

  const router = useRouter()  // Using useRouter for navigation

  useEffect(() => {
    const fetchData = async () => {
      // Fetch total clients
      const { data: totalData, error: totalError } = await supabase
        .from("Clients")
        .select("client_id", { count: "exact" })
      if (totalError) {
        console.error("Error fetching total clients:", totalError)
      } else {
        setTotalClients(totalData?.length || 0)
      }

      // Fetch active clients
      const { data: activeData, error: activeError } = await supabase
        .from("Clients")
        .select("client_id")
        .eq("client_status", "active")
      if (activeError) {
        console.error("Error fetching active clients:", activeError)
      } else {
        setActiveClients(activeData?.length || 0)
      }

      // Fetch inactive clients
      const { data: inactiveData, error: inactiveError } = await supabase
        .from("Clients")
        .select("client_id")
        .eq("client_status", "inactive")
      if (inactiveError) {
        console.error("Error fetching inactive clients:", inactiveError)
      } else {
        setInactiveClients(inactiveData?.length || 0)
      }

      // Fetch total services - revised to fetch records first and then count
      const { data: serviceData, error: serviceError } = await supabase
        .from("services")
        .select("id") // Ensure this is the correct column
      if (serviceError) {
        console.error("Error fetching total services:", serviceError)
      } else {
        setTotalServices(serviceData?.length || 0) // Manually count the records
      }

      // Fetch total agreements
      const { data: agreementsData, error: agreementsError } = await supabase
        .from("agreements")
        .select("agreement_id", { count: "exact" })
      if (agreementsError) {
        console.error("Error fetching total agreements:", agreementsError)
      } else {
        setTotalAgreements(agreementsData?.length || 0)
      }
    }

    fetchData()
  }, [])

  // Navigate to the clients or agreements page with a filter
  const handleNavigate = (page: string) => {
    router.push(`/${page}`)  // Navigate to either clients or agreements page
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card
          onClick={() => handleNavigate("clients")}
          className="cursor-pointer" // Added pointer cursor for Total Clients card
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Clients</CardTitle>
            <Users className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalClients}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleNavigate("clients?status=active")}
          className="cursor-pointer" // Added pointer cursor for Active Clients card
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Active Clients</CardTitle>
            <UserCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeClients}</div>
            <p className="text-xs text-gray-500">
              {((activeClients / totalClients) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleNavigate("clients?status=inactive")}
          className="cursor-pointer" // Added pointer cursor for Inactive Clients card
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Inactive Clients</CardTitle>
            <UserX className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{inactiveClients}</div>
            <p className="text-xs text-gray-500">
              {((inactiveClients / totalClients) * 100).toFixed(0)}% of total
            </p>
          </CardContent>
        </Card>

        <Card
          onClick={() => handleNavigate("agreements")}
          className="cursor-pointer" // Added pointer cursor for Total Agreements card
        >
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Agreements</CardTitle>
            <FileText className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAgreements}</div>
            {/* <p className="text-xs text-gray-500">1.27 per client</p> */}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Services</CardTitle>
            <Settings className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalServices}</div>
            <p className="text-xs text-gray-500">
              {/* {(totalServices / totalClients).toFixed(2)} per client */}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts and Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Client Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <DashboardChart />
          </CardContent>
        </Card>

        <Card className="lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Contract Expiry Alerts</CardTitle>
            <AlertTriangle className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <DashboardAlerts />
          </CardContent>
        </Card>
      </div>

      {/* Client Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <DashboardTable />
        </CardContent>
      </Card>
    </div>
  )
}
