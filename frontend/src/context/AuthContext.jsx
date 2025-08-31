

// import { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [token, setToken] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     console.log("AuthContext: 1. Initializing session from localStorage.");
//     const storedToken = localStorage.getItem("token");
//     const storedUser = localStorage.getItem("user");

//     if (storedToken && storedUser) {
//       console.log("AuthContext: 2. Found token and user in storage. Setting state now.");
//       setUser(JSON.parse(storedUser));
//       setToken(storedToken);
//     } else {
//       console.log("AuthContext: 2. No token/user found in storage.");
//     }
    
//     console.log("AuthContext: 3. Finished loading session. Setting loading to false.");
//     setLoading(false);
//   }, []);

//   const login = (userData, authToken) => {
//     console.log("AuthContext: LOGIN function called with user and token.");
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("token", authToken);
//     setUser(userData);
//     setToken(authToken);
//     console.log("AuthContext: State and localStorage have been updated.");
//   };

//   const logout = () => {
//     console.log("AuthContext: LOGOUT function called.");
//     localStorage.removeItem("user");
//     localStorage.removeItem("token");
//     setUser(null);
//     setToken(null);
//   };

//   const value = {
//     user,
//     token,
//     loading,
//     login,
//     logout,
//     isAuthenticated: !!user && !!token,
//   };

//   // This log will fire on every render, telling us the current state.
//   console.log("AuthContext: STATE UPDATE - isAuthenticated:", value.isAuthenticated, "| loading:", value.loading);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// };


// frontend/src/context/AuthContext.js

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setUser(JSON.parse(storedUser));
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // ✅ THE FIX: Wrap login in useCallback.
  // This ensures the function itself doesn't change on re-renders,
  // preventing the infinite loop in AuthCallback.
  const login = useCallback((userData, authToken) => {
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", authToken);
    setUser(userData);
    setToken(authToken);
  }, []);

  // ✅ THE FIX: Also wrap logout in useCallback for consistency.
  const logout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    login,
    logout,
    isAuthenticated: !!user && !!token,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};