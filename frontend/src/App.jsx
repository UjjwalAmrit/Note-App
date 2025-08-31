// "use client"

// import { Routes, Route, Navigate, useLocation } from "react-router-dom" // 1. Import useLocation
// import { useAuth } from "./context/AuthContext"
// import Navbar from "./components/Navbar"
// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Dashboard from "./pages/Dashboard"
// import AuthCallback from "./pages/AuthCallback"
// import "./App.css"

// function App() {
//   const { loading } = useAuth()
//   const location = useLocation() // 2. Get the current location

//   if (loading) {
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading...</p>
//       </div>
//     )
//   }

//   return (
//     <div className="App">
//       {/* 3. Conditionally render the Navbar */}
//       {location.pathname !== "/dashboard" && <Navbar />}
      
//       <main className="main-content">
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route path="/auth/callback" element={<AuthCallback />} />
//           <Route
//             path="/dashboard"
//             element={
//                 <Dashboard />
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   )
// }

// export default App


"use client"

import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import AuthCallback from "./pages/AuthCallback"
import "./App.css"

function App() {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  // This is the "waiting" logic. While the AuthContext is checking
  // localStorage, we show a global loading screen.
  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading session...</p>
      </div>
    )
  }

  return (
    <div className="App">
      {/* This logic correctly hides the Navbar on the dashboard */}
      {location.pathname !== "/dashboard" && <Navbar />}
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* This is the protection logic integrated directly */}
          <Route
            path="/dashboard"
            element={
              isAuthenticated ? (
                <Dashboard />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* A catch-all route to redirect any unknown URL to the home page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App