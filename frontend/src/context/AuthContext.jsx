// "use client"

// import { createContext, useContext, useState, useEffect } from "react"
// import { authAPI } from "../services/api"

// const AuthContext = createContext()

// export const useAuth = () => {
//   const context = useContext(AuthContext)
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider")
//   }
//   return context
// }

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null)
//   const [loading, setLoading] = useState(true)
//   const [token, setToken] = useState(localStorage.getItem("token"))

//   useEffect(() => {
//     const initializeAuth = async () => {
//       const storedToken = localStorage.getItem("token")
//       if (storedToken) {
//         try {
//           // Verify token with backend
//           const response = await authAPI.getProfile()
//           setUser(response.data.user)
//           setToken(storedToken)
//         } catch (error) {
//           console.error("Token verification failed:", error)
//           localStorage.removeItem("token")
//           setToken(null)
//         }
//       }
//       setLoading(false)
//     }

//     initializeAuth()
//   }, [])

//   const login = (userData, authToken) => {
//     setUser(userData)
//     setToken(authToken)
//     localStorage.setItem("token", authToken)
//   }

//   const logout = () => {
//     setUser(null)
//     setToken(null)
//     localStorage.removeItem("token")
//   }

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user && !!token,
//   }

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }


"use client"

import { createContext, useContext, useState, useEffect } from "react"
// No need to import authAPI here anymore for initialization
// It's handled globally by the interceptor in api.js

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
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // This effect runs once when the app starts to restore the session
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token")
      const storedUser = localStorage.getItem("user") // <-- Get user from storage

      if (storedToken && storedUser) {
        // If we have a token and user in storage, set them in the state immediately
        // This makes the app feel instant on refresh
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
      }
      // We are done checking storage, so we can stop the initial loading state
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = (userData, authToken) => {
    // ✅ BUG FIX: Save BOTH the user object and the token to localStorage
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
    setUser(userData)
    setToken(authToken)
  }

  const logout = () => {
    // Clear everything from storage and state
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
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



