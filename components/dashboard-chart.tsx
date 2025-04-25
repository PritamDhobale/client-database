"use client"

import { useEffect, useState } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { supabase } from "@/lib/supabaseClient"

// Define shorter category names for the chart
const categoryNames = {
  "INDEPENDENT PRACTICES: Direct House Accounts": "Independent Direct House",
  "INDEPENDENT PRACTICES: Channel Partner Accounts": "Independent Channel Partner",
  "CORPORATE PRACTICES: House Accounts": "Corporate House",
  "CORPORATE ADVISORY": "Corporate Advisory",
}

const COLORS = ["#91C848", "#36A2EB", "#FFCE56", "#FF6384"]

export function DashboardChart() {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    const fetchCategoryData = async () => {
      const { data, error } = await supabase
        .from("Clients")
        .select("category_id, category:category_id(category_name)")

      if (error) {
        console.error("Error fetching category data:", error)
        return
      }

      // Process data to count clients by category
      const categoryCounts = data?.reduce((acc: any, client: any) => {
        const categoryName = client.category?.category_name || "Other"
        if (acc[categoryName]) {
          acc[categoryName] += 1
        } else {
          acc[categoryName] = 1
        }
        return acc
      }, {})

      const chartData = Object.keys(categoryCounts).map((category) => ({
        name: categoryNames[category as keyof typeof categoryNames] || category, // Use shortened category names
        value: categoryCounts[category],
      }))
      
      setChartData(chartData)
    }

    fetchCategoryData()
  }, [])

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} // No need for multi-line, keep horizontal
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal" // Change layout to horizontal to keep it neat
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ width: '100%', paddingBottom: '10px' }} // Adjust legend positioning
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
