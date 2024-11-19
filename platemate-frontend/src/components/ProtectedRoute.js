import React from "react";
import { Navigate } from "react-router-dom";
import useUserContext from "../contexts/UserContext";

export default function ProtectedRoute({ children }) {
  const { loggedIn, isStateLoading } = useUserContext();

  console.log(loggedIn, isStateLoading)

  // Show a loader or null while state is loading
  if (isStateLoading) {
    return null; // Optionally, return a spinner or loading indicator
  }

  // Redirect to login if not logged in
  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  // Render children if logged in
  return children;
}
