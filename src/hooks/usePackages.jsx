"use client"

import { useState, useEffect } from "react"

export const usePackages = () => {
  const [packages, setPackages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setPackages([
            { id: 1, name: "Basic Package", description: "1 hour court booking", price: 50, duration: "1 hour" },
            {
              id: 2,
              name: "Standard Package",
              description: "2 hour court booking with coach",
              price: 120,
              duration: "2 hours",
            },
            {
              id: 3,
              name: "Premium Package",
              description: "4 hour court booking with coach and equipment",
              price: 200,
              duration: "4 hours",
            },
            {
              id: 4,
              name: "Elite Package",
              description: "Full day court access with premium services",
              price: 500,
              duration: "8 hours",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [])

  return { packages, isLoading, error }
}

