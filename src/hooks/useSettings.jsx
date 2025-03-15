"use client"

import { useState, useEffect } from "react"

export const useSettings = () => {
  const [settings, setSettings] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchSettings = async () => {
      setIsLoading(true)

      try {
        // Simulate API call
        setTimeout(() => {
          setSettings({
            platformFee: 5,
            notificationsEnabled: true,
            autoApproveReviews: false,
            maintenanceMode: false,
            twoFactorAuth: true,
            dataRetentionDays: 90,
          })
          setIsLoading(false)
        }, 1000)
      } catch (err) {
        setError(err)
        setIsLoading(false)
      }
    }

    fetchSettings()
  }, [])

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }))
    // In a real app, you would make an API call here
  }

  return { settings, updateSettings, isLoading, error }
}

