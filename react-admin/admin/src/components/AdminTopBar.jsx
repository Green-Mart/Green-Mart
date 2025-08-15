// components/AdminTopBar.jsx
import React from 'react';

const AdminTopBar = () => {
  return (
    <div style={styles.topBar}>
      <h2 style={styles.title}>Admin Dashboard</h2>
      <div style={styles.profileSection}>
        <input type="text" placeholder="Search..." style={styles.searchInput} />
        {/* <img
          src="https://via.placeholder.com/32" // Replace with actual admin photo if needed
          alt="Admin"
          style={styles.avatar}
        /> */}
      </div>
    </div>
  );
};

const styles = {
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#ffffff',
    padding: '10px 20px',
    borderBottom: '1px solid #e0e0e0',
  },
  title: {
    fontSize: '20px',
    color: '#333',
  },
  profileSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  searchInput: {
    padding: '6px 10px',
    border: '1px solid #ccc',
    borderRadius: '6px',
  },
  avatar: {
    height: '32px',
    width: '32px',
    borderRadius: '50%',
  },
};

export default AdminTopBar;
