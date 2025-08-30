"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { authAPI } from "../services/api"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem("token"))

  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("token")
      if (storedToken) {
        try {
          // Verify token with backend
          const response = await authAPI.getProfile()
          setUser(response.data.user)
          setToken(storedToken)
        } catch (error) {
          console.error("Token verification failed:", error)
          localStorage.removeItem("token")
          setToken(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData, authToken) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("token", authToken)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem("token")
  }

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
