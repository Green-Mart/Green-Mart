import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AdminSidebar from '../components/AdminSidebar';
import {Outlet , useLocation} from 'react-router-dom';
import {Line} from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const location = useLocation();
  const isDashboardHome = location.pathname === '/dashboard' || location.pathname === '/dashboard/';
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalCategories, setTotalCategories] = useState(0);
  const [monthlySales, setMonthlySales] = useState({ month: [], totalSales: [] });
  const [topProducts, setTopProducts] = useState([]);

  
  const token = localStorage.getItem("Token"); // adjust based on your auth storage

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // debugger
        // Total Users
        const usersRes = await axios.get("http://localhost:4000/admin/stats/totalUsers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalUsers(usersRes.data.data.totalUsers);

        // Total Products
        const productsRes = await axios.get("http://localhost:4000/admin/stats/totalProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalProducts(productsRes.data.data.totalProducts);

        // Total Orders
        const ordersRes = await axios.get("http://localhost:4000/admin/stats/totalOrders", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalOrders(ordersRes.data.data.totalOrders);

        // Total Categories
        const categoriesRes = await axios.get("http://localhost:4000/admin/stats/totalCategories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTotalCategories(categoriesRes.data.data.totalCategories);

        // Monthly Sales
        const monthlySalesRes = await axios.get("http://localhost:4000/admin/stats/monthlySales", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const raw = monthlySalesRes.data.data;
        const transformed = {
          month: raw.map(item => item.month),
          totalSales: raw.map(item => Number(item.totalSales)),
        };
        setMonthlySales(transformed);

        // Top Sold Products
        const topProductsRes = await axios.get("http://localhost:4000/admin/stats/topProducts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTopProducts(topProductsRes.data.data);


      } catch (err) {
        console.error("Error fetching stats:", err);
      }
    };

    fetchStats();
  }, [token]);

  // ...existing code...

return (
  <div style={{ display: 'flex', minHeight: '100vh', overflowX: 'hidden' }}>
    <AdminSidebar />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={styles.container}>
        <h1 style={styles.header}>Dashboard Overview</h1>
        {isDashboardHome && (
          <>
            <div style={styles.cardGrid}>
              {/* Cards */}
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Total Users</h2>
                <p style={styles.cardValue}>{totalUsers}</p>
              </div>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Total Products</h2>
                <p style={styles.cardValue}>{totalProducts}</p>
              </div>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Total Orders</h2>
                <p style={styles.cardValue}>{totalOrders}</p>
              </div>
              <div style={styles.card}>
                <h2 style={styles.cardTitle}>Total Categories</h2>
                <p style={styles.cardValue}>{totalCategories}</p>
              </div>
            </div>
            {/* Monthly Sales Chart & Top Products */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
              <div style={{ marginTop: '40px', maxWidth: 500, width: '100%' }}>
                <h2 style={styles.header}>Monthly Sales</h2>
                <Line
                  data={{
                    labels: monthlySales.month,
                    datasets: [
                      {
                        label: 'Sales ($)',
                        data: monthlySales.totalSales,
                        borderColor: '#3b82f6',
                        backgroundColor: '#bfdbfe',
                        tension: 0.4,
                        fill: true,
                      },
                    ],
                  }}
                  height={200}
                />
              </div>
              <div style={{ marginTop: '30px', maxWidth: 400, width: '100%' }}>
                <h2 style={styles.header}>Top 5 Selling Products</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                  {topProducts.map((product, index) => (
                    <li key={index} style={styles.topProductItem}>
                      <span>{product.productName}</span>
                      <span style={{ fontWeight: 'bold' }}>{product.totalSold} sold</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </>
        )}
        <Outlet />
      </div>
    </div>
  </div>
);
};

const styles = {
  container: {
    padding: '30px',
    backgroundColor: '#f9fafb',
    minHeight: '100vh',
  },
  header: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '30px',
    color: '#111827',
  },
  cardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
  },
  card: {
    backgroundColor: '#ffffff',
    padding: '25px',
    borderRadius: '12px',
    boxShadow: '0 4px 8px rgba(0,0,0,0.06)',
    transition: 'transform 0.2s ease',
    textAlign: 'center',
  },
  cardTitle: {
    fontSize: '18px',
    color: '#4b5563',
    marginBottom: '10px',
  },
  cardValue: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#0284c7',
  },
  topProductItem: {
  backgroundColor: '#fff',
  marginBottom: '10px',
  padding: '15px 20px',
  borderRadius: '8px',
  boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}
};

export default Dashboard;
