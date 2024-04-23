// ProtectedRoute.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

// Define a functional component for protected routes
const ProtectedRoute = ({ isLoggedIn }) => {
  return isLoggedIn ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;
