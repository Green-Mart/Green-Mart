import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaBoxOpen, FaClipboardList, FaUsers, FaTags, FaStar, FaSignOutAlt } from 'react-icons/fa';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: <FaTachometerAlt /> },
  { to: '/dashboard/products', label: 'Products', icon: <FaBoxOpen /> },
  { to: '/dashboard/orders', label: 'Orders', icon: <FaClipboardList /> },
  { to: '/dashboard/users', label: 'Users', icon: <FaUsers /> },
  { to: '/dashboard/categories', label: 'Categories', icon: <FaTags /> },
  { to: '/dashboard/reviews/:userId', label: 'Reviews', icon: <FaStar /> },
];

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout logic here
    console.log('Logging out...');
    localStorage.removeItem('Token');
    localStorage.removeItem('userId');
    localStorage.removeItem('role');
    localStorage.removeItem('name');
    navigate('/login');
  };

  return (
    <div style={styles.sidebar}>
      {/* App Name or Logo */}
      <div style={styles.header}>
        <h2 style={styles.appTitle}>Admin Panel</h2>
      </div>

      {/* Navigation Items */}
      <div style={styles.navContainer}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            style={({ isActive }) => ({
              ...styles.navLink,
              ...(isActive ? styles.activeNavLink : {}),
            })}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      {/* Logout Button */}
      <div style={styles.logoutContainer}>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          <FaSignOutAlt style={styles.icon} />
          Logout
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: '250px',
    height: '100vh',
    backgroundColor: '#f9fafb',
    display: 'flex',
    flexDirection: 'column',
    borderRight: '1px solid #e5e7eb',
    justifyContent: 'space-between',
  },
  header: {
    padding: '20px',
    borderBottom: '1px solid #e5e7eb',
  },
  appTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
  },
  navContainer: {
    paddingTop: '10px',
    flexGrow: 1,
  },
  navLink: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 20px',
    textDecoration: 'none',
    color: '#374151',
    fontSize: '16px',
    borderLeft: '4px solid transparent',
    transition: 'all 0.2s ease-in-out',
  },
  activeNavLink: {
    backgroundColor: '#e0f2fe',
    color: '#0284c7',
    borderLeft: '4px solid #0284c7',
    fontWeight: 'bold',
  },
  icon: {
    marginRight: '10px',
  },
  logoutContainer: {
    padding: '20px',
    borderTop: '1px solid #e5e7eb',
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#ef4444',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default AdminSidebar;
