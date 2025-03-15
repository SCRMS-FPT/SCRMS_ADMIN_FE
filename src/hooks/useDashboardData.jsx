"use client"

import { useState, useEffect } from "react"

export const useDashboardData = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalCourts: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentTransactions: [],
    bookingTrends: [],
    packageSales: [],
    notifications: [],
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)

      try {
        // Simulate API call with timeout
        setTimeout(() => {
          setData({
            totalUsers: 2458,
            totalCourts: 187,
            totalBookings: 12543,
            totalRevenue: 458750,
            recentTransactions: [
              { id: 1, user: "John Doe", amount: 120, status: "completed", date: "2023-05-12" },
              { id: 2, user: "Jane Smith", amount: 85, status: "completed", date: "2023-05-11" },
              { id: 3, user: "Robert Johnson", amount: 200, status: "failed", date: "2023-05-10" },
              { id: 4, user: "Emily Davis", amount: 150, status: "pending", date: "2023-05-09" },
            ],
            bookingTrends: [
              { date: "Jan", count: 120 },
              { date: "Feb", count: 150 },
              { date: "Mar", count: 180 },
              { date: "Apr", count: 220 },
              { date: "May", count: 250 },
              { date: "Jun", count: 280 },
              { date: "Jul", count: 310 },
            ],
            packageSales: [
              { name: "Basic", sales: 120 },
              { name: "Standard", sales: 210 },
              { name: "Premium", sales: 180 },
              { name: "Elite", sales: 90 },
            ],
            notifications: [
              { id: 1, type: "alert", message: "Failed transaction for user #1245", time: "2 hours ago" },
              { id: 2, type: "warning", message: "Review violation reported", time: "5 hours ago" },
              { id: 3, type: "info", message: "New court owner registered", time: "1 day ago" },
            ],
          })
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return { data, isLoading, error }
}

