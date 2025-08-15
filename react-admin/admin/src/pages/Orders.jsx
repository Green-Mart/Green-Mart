// pages/Orders.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, Legend
} from 'recharts';

const COLORS = ['#4F46E5', '#16A34A', '#F59E0B', '#EF4444', '#8B5CF6'];

const Orders = () => {
  const [summary, setSummary] = useState(null);
  const [salesData, setSalesData] = useState([]);
  const [topCustomers, setTopCustomers] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categoryDistribution, setCategoryDistribution] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("Token");

    const fetchAllData = async () => {
      try {
        const [summaryRes, salesRes, customersRes, productsRes, categoryRes] = await Promise.all([
          axios.get('http://localhost:4000/admin/stats/orders/summary', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/admin/stats/admin/orders/sales-trend', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/admin/stats/orders/top-customers', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/admin/stats/orders/most-popular-products', { headers: { Authorization: `Bearer ${token}` } }),
          axios.get('http://localhost:4000/admin/stats/orders/category-distribution', { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setSummary(summaryRes.data);
        setSalesData(salesRes.data);
        setTopCustomers(customersRes.data);
        setTopProducts(productsRes.data);
        setCategoryDistribution(
          categoryRes.data.map(item => ({
            ...item,
            totalRevenue: parseFloat(item.totalRevenue)
          }))
        );
      } catch (error) {
        console.error("❌ Failed to fetch order analytics", error);
      }
    };

    fetchAllData();
  }, []);

  if (!summary) return <p style={styles.loading}>Loading...</p>;

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📊 Order Analytics</h2>

      {/* Summary Cards */}
      <div style={styles.grid}>
        <SummaryCard title="Total Orders" value={summary.totalOrders} />
        <SummaryCard title="Total Revenue" value={`₹${summary.totalRevenue}`} />
        <SummaryCard title="Avg Order Value" value={`₹${summary.averageOrderValue}`} />
        <SummaryCard title="Orders Today" value={summary.ordersToday} />
      </div>

      {salesData.length > 0 && <SalesTrendChart data={salesData} />}
      {topCustomers.length > 0 && <TopCustomersTable customers={topCustomers} />}
      {topProducts.length > 0 && <TopProductsTable products={topProducts} />}
      {categoryDistribution.length > 0 && <CategoryDistributionChart data={categoryDistribution} />}
    </div>
  );
};

const SummaryCard = ({ title, value }) => (
  <div style={styles.card}>
    <h3 style={styles.cardTitle}>{title}</h3>
    <p style={styles.cardValue}>{value}</p>
  </div>
);

const SalesTrendChart = ({ data }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionHeading}>📈 Sales Trend (Last 30 Days)</h2>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" tickFormatter={(d) => new Date(d).toISOString().split('T')[0]} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="totalRevenue" stroke="#4F46E5" strokeWidth={2} name="Revenue (₹)" />
        <Line type="monotone" dataKey="totalOrders" stroke="#16A34A" strokeWidth={2} name="Orders" />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

const TopCustomersTable = ({ customers }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionHeading}>🏆 Top Customers</h2>
    <table style={styles.table}>
      <thead>
  <tr>
    <th style={styles.tableHeader}>User</th>
    <th style={styles.tableHeader}>Email</th>
    <th style={styles.tableHeader}>Total Spent (₹)</th>
    <th style={styles.tableHeader}>Total Orders</th>
  </tr>
</thead>
<tbody>
  {customers.map((c, i) => (
    <tr style={styles.tableRow}>
      <td style={styles.tableCell}>{c.userName}</td>
      <td style={styles.tableCell}>{c.userEmail}</td>
      <td style={styles.tableCell}>₹{c.totalSpent}</td>
      <td style={styles.tableCell}>{c.totalOrders}</td>
    </tr>
  ))}
</tbody>
    </table>
  </div>
);

const TopProductsTable = ({ products }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionHeading}>🔥 Top Selling Products</h2>
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>Product</th>
          <th style={styles.tableHeader}>Category</th>
          <th style={styles.tableHeader}>Quantity Sold</th>
          <th style={styles.tableHeader}>Total Revenue (₹)</th>
        </tr>
      </thead>
      <tbody>
        {products.map(p => (
          <tr key={p.productId}>
            <td style={styles.tableCell}>{p.productName}</td>
            <td style={styles.tableCell}>{p.categoryName}</td>
            <td style={styles.tableCell}>{p.quantitySold}</td>
            <td style={styles.tableCell}>₹{p.totalRevenue}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const CategoryDistributionChart = ({ data }) => (
  <div style={styles.section}>
    <h2 style={styles.sectionHeading}>📂 Revenue by Category</h2>
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          dataKey="totalRevenue"
          nameKey="categoryName"
          cx="50%"
          cy="50%"
          outerRadius={100}
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
);

const styles = {
  container: { padding: 30, backgroundColor: '#f9fafb', minHeight: '100vh' },
  heading: { fontSize: 26, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    textAlign: 'center',
    boxShadow: '0 4px 10px rgba(0,0,0,0.05)',
    transition: 'transform 0.2s ease',
  },
  cardTitle: { fontSize: 16, fontWeight: '500', color: '#6b7280' },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: '#111827' },
  section: { marginTop: 40, backgroundColor: '#fff', padding: 20, borderRadius: 12, boxShadow: '0 4px 10px rgba(0,0,0,0.05)' },
  sectionHeading: { fontSize: 20, fontWeight: 'bold', marginBottom: 20, color: '#111827' },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  loading: { textAlign: 'center', marginTop: 50, fontSize: 18, color: '#6b7280' },
  // Add this inside styles object (replace the old `table` style with these new ones)
table: {
  width: '100%',
  borderCollapse: 'separate',
  borderSpacing: 0,
  backgroundColor: '#fff',
  borderRadius: 10,
  overflow: 'hidden',
  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
},
tableHeader: {
  backgroundColor: '#f3f4f6',
  textAlign: 'left',
  padding: '12px 16px',
  fontSize: 14,
  fontWeight: '600',
  color: '#374151',
  borderBottom: '2px solid #e5e7eb',
},
tableCell: {
  padding: '12px 16px',
  fontSize: 14,
  color: '#111827',
  borderBottom: '1px solid #f3f4f6',
},
tableRow: {
  transition: 'background-color 0.2s ease',
},
tableRowHover: {
  backgroundColor: '#f9fafb',
},
stripedRow: {
  backgroundColor: '#fafafa',
},

};

export default Orders;
