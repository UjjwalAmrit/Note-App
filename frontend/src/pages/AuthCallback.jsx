// "use client"

// import { useEffect } from "react"
// import { useNavigate, useSearchParams } from "react-router-dom"
// import { useAuth } from "../context/AuthContext"

// const AuthCallback = () => {
//   const [searchParams] = useSearchParams()
//   const navigate = useNavigate()
//   const { login } = useAuth()

//   useEffect(() => {
//     const token = searchParams.get("token")
//     const userParam = searchParams.get("user")
//     const error = searchParams.get("error")

//     if (error) {
//       // Handle authentication errors
//       let errorMessage = "Authentication failed"
//       switch (error) {
//         case "google_auth_failed":
//           errorMessage = "Google authentication failed. Please try again."
//           break
//         case "auth_error":
//           errorMessage = "An error occurred during authentication."
//           break
//         case "auth_failed":
//           errorMessage = "Authentication was cancelled or failed."
//           break
//       }

//       navigate(`/login?error=${encodeURIComponent(errorMessage)}`)
//       return
//     }

//     if (token && userParam) {
//       try {
//         const user = JSON.parse(decodeURIComponent(userParam))
//         login(user, token)
//         navigate("/dashboard")
//       } catch (error) {
//         console.error("Error parsing user data:", error)
//         navigate("/login?error=Invalid authentication data")
//       }
//     } else {
//       navigate("/login?error=Missing authentication data")
//     }
//   }, [])

//   return (
//     <div className="loading-container">
//       <div className="loading-spinner"></div>
//       <p>Completing authentication...</p>
//     </div>
//   )
// }

// export default AuthCallback


// frontend/src/pages/AuthCallback.jsx

import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const userParam = searchParams.get("user");
    const error = searchParams.get("error");

    if (error) {
      console.error("Authentication error from backend:", error);
      navigate(`/login?error=${error}`);
      return;
    }

    if (token && userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        // This component's ONLY job is to call login.
        login(user, token);
      } catch (e) {
        console.error("Failed to parse user data from URL:", e);
        navigate("/login?error=Invalid session data");
      }
    } else {
      console.error("Missing token or user data in callback.");
      navigate("/login?error=Incomplete session data");
    }
  }, [searchParams, login, navigate]);

  // A simple loading indicator while the login process happens
  return (
    <div className="loading-container">
      <div className="loading-spinner"></div>
      <p>Finalizing authentication...</p>
    </div>
  );
};

export default AuthCallback;