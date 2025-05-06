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

const COLORS = ["#C9E4A4", "#FAC086", "#DAAAE4", "#A7DCF7"]

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
        name: categoryNames[category as keyof typeof categoryNames] || category,
        value: categoryCounts[category],
      }))

      setChartData(chartData)
    }

    fetchCategoryData()
  }, [])

  // ✅ Custom label with font size and positioning
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
  }: any) => {
    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 1.15
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
      <text
        x={x}
        y={y}
        fill="#000"
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={13} // You can adjust this
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    )
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={renderCustomizedLabel} // ✅ Apply custom label
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="horizontal"
            align="center"
            verticalAlign="bottom"
            wrapperStyle={{ width: '100%', paddingBottom: '10px', fontSize: '14px' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
