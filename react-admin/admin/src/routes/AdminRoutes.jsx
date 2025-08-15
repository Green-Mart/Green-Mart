import React from "react";
import { Navigate, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProtectedRoute from "../components/ProtectedRoute"; // for login protection
// import ProtectedAdminRoute from "../components/ProtectedAdminRoute"; // for admin layout protection

import Dashboard from "../pages/Dashboard"; // layout with sidebar etc.
import Products from "../pages/Products";
import Orders from "../pages/Orders";
import Users from "../pages/Users";
import Reviews from "../pages/Reviews";
import Categories from "../pages/Categories";
import AddProduct from "../pages/AddProduct";
import EditProduct from "../pages/EditProduct"; 
import TopBuyers from "../pages/TopBuyers"; 

const AdminRoutes = () => {
  return (
    <Routes>
      {/* Redirect root to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected admin dashboard routes */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route element={<Dashboard />}>
          <Route index element={<h2>==================================================================================================================</h2>} />
          <Route path="products" element={<Products />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="reviews/:userId" element={<Reviews />} />
          <Route path="categories" element={<Categories />} />
          <Route path="add-product" element={<AddProduct />} />
          <Route path="edit-product/:productId" element={<EditProduct />} />
          <Route path="top-buyers" element={<TopBuyers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
