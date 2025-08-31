// frontend/src/App.jsx

// import { Routes, Route, Navigate, useLocation } from "react-router-dom";
// import { useAuth } from "./context/AuthContext";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
// import Dashboard from "./pages/Dashboard";
// import AuthCallback from "./pages/AuthCallback";
// import "./App.css";

// function App() {
//   const { isAuthenticated, loading } = useAuth();
//   const location = useLocation();

//   console.log(`App.jsx: Rendering page. Path: ${location.pathname}. Auth State: isAuthenticated=${isAuthenticated}, loading=${loading}`);

//   if (loading) {
//     console.log("App.jsx: DECISION - Showing loading screen because loading=true.");
//     return (
//       <div className="loading-container">
//         <div className="loading-spinner"></div>
//         <p>Loading session...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="App">
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
//               isAuthenticated ? (
//                 <Dashboard />
//               ) : (
//                 <Navigate to="/login" replace />
//               )
//             }
//           />
          
//           <Route path="*" element={<Navigate to="/" replace />} />
//         </Routes>
//       </main>
//     </div>
//   );
// }

// export default App;


// frontend/src/App.jsx

import { useEffect } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import AuthCallback from "./pages/AuthCallback";
import "./App.css";

function App() {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // This new useEffect is the core of the fix.
  // It watches for the user to become authenticated.
  useEffect(() => {
    // If we are done loading and the user is now authenticated,
    // and they are currently on the callback page...
    if (!loading && isAuthenticated && location.pathname === "/auth/callback") {
      // ...then it is safe to redirect them to the dashboard.
      navigate("/dashboard");
    }
  }, [isAuthenticated, loading, location.pathname, navigate]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading session...</p>
      </div>
    );
  }

  return (
    <div className="App">
      {location.pathname !== "/dashboard" && <Navbar />}
      
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Protected Route */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" replace />}
          />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;