// "use client"

// import { Routes, Route, Navigate, useLocation } from "react-router-dom" // 1. Import useLocation
// import { useAuth } from "./context/AuthContext"
// import Navbar from "./components/Navbar"
// import Home from "./pages/Home"
// import Login from "./pages/Login"
// import Signup from "./pages/Signup"
// import Dashboard from "./pages/Dashboard"
// import AuthCallback from "./pages/AuthCallback"
// import ProtectedRoute from "./components/ProtectedRoute"
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
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   )
// }

// export default App


// frontend/src/App.jsx

import React from 'react';
// ... other imports ...
import './App.css';

function App() {
  // ... all your component logic, JSX, etc. ...
  // This is the comment you added to force the deploy
  return (
    <div className="App">
      {/* Your application content */}
    </div>
  );
}

// ✅ ENSURE THIS LINE IS AT THE VERY BOTTOM OF THE FILE
export default App;