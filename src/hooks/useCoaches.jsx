"use client"

import { useState, useEffect } from "react"

export const useCoaches = () => {
  const [coaches, setCoaches] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCoaches = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setCoaches([
            { id: 1, name: "Alex Johnson", specialization: "Tennis", experience: "10 years", rating: 4.8 },
            { id: 2, name: "Sarah Williams", specialization: "Badminton", experience: "8 years", rating: 4.7 },
            { id: 3, name: "David Miller", specialization: "Tennis", experience: "15 years", rating: 4.9 },
            { id: 4, name: "Lisa Brown", specialization: "Squash", experience: "6 years", rating: 4.5 },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchCoaches()
  }, [])

  return { coaches, isLoading, error }
}

