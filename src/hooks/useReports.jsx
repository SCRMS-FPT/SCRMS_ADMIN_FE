"use client"

import { useState, useEffect } from "react"

export const useReports = () => {
  const [reports, setReports] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setReports([
            {
              id: 1,
              type: "Review",
              reporter: "John Doe",
              reported: "Tennis Club A",
              reason: "Inappropriate content",
              status: "pending",
            },
            { id: 2, type: "User", reporter: "Admin", reported: "User123", reason: "Spam", status: "resolved" },
            {
              id: 3,
              type: "Court",
              reporter: "Jane Smith",
              reported: "Court B",
              reason: "Misleading information",
              status: "pending",
            },
            {
              id: 4,
              type: "Coach",
              reporter: "Robert Johnson",
              reported: "Coach X",
              reason: "Unprofessional behavior",
              status: "under review",
            },
          ])
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchReports()
  }, [])

  return { reports, isLoading, error }
}

