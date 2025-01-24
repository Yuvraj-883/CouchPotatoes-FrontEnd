import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userDetails, setUserDetails] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      const user = validateToken(token); // Validate and decode the token
      if (user) {
        setIsAuthenticated(true);
        setUserDetails(user);
      } else {
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    } else {
      setIsAuthenticated(false);
      setUserDetails(null);
    }
  }, []);

  const validateToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT payload
      const isExpired = payload.exp * 1000 < Date.now(); // Check expiration
      return isExpired ? null : payload; // Return payload if valid
    } catch (error) {
      return null;
    }
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    setIsAuthenticated(false);
    setUserDetails(null);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, userDetails, setIsAuthenticated, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
