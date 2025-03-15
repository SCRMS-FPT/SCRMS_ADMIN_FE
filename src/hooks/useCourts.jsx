"use client"

import { useState, useEffect } from "react"

export const useCourts = () => {
  const [courts, setCourts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCourts = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setCourts([
            { id: 1, name: "Downtown Tennis Club", cluster: "Downtown", status: "active", address: "123 Main St" },
            { id: 2, name: "Westside Sports Center", cluster: "West", status: "active", address: "456 West Ave" },
            {
              id: 3,
              name: "Eastside Tennis Academy",
              cluster: "East",
              status: "maintenance",
              address: "789 East Blvd",
            },
            { id: 4, name: "Northside Courts", cluster: "North", status: "active", address: "101 North St" },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchCourts()
  }, [])

  return { courts, isLoading, error }
}

