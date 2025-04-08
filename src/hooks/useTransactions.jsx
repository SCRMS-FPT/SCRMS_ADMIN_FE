"use client"

import { useState, useEffect } from "react"

export const useTransactions = () => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setTransactions([
            { id: 1, user: "John Doe", type: "Booking", amount: 120, status: "completed", date: "2023-05-12" },
            { id: 2, user: "Jane Smith", type: "Package", amount: 200, status: "completed", date: "2023-05-11" },
            { id: 3, user: "Robert Johnson", type: "Booking", amount: 85, status: "failed", date: "2023-05-10" },
            { id: 4, user: "Emily Davis", type: "Coaching", amount: 150, status: "pending", date: "2023-05-09" },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return { transactions, isLoading, error }
}

