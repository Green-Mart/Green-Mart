import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedAdminRoute = () => {
  const token = localStorage.getItem('Token');
  const role = localStorage.getItem('role');

  return token && role === 'admin' ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedAdminRoute;
