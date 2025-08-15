import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TopBuyers = () => {
  const [buyers, setBuyers] = useState([]);

  useEffect(() => {
    fetchTopBuyers();
  }, []);

  const fetchTopBuyers = async () => {
    try {
        // debugger
      const res = await axios.get('http://localhost:4000/admin/stats/top-buyers',{  
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}` // Adjust based on your
        }
      });
      setBuyers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Top Customers</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>#</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Email</th>
            <th style={thStyle}>Total Spent</th>
            <th style={thStyle}>Top Category</th>
          </tr>
        </thead>
        <tbody>
          {buyers.map((buyer, index) => (
            <tr key={buyer.userId}>
              <td style={tdStyle}>{index + 1}</td>
              <td style={tdStyle}>{buyer.userName}</td>
              <td style={tdStyle}>{buyer.userEmail}</td>
              <td style={tdStyle}>₹{Number(buyer.totalSpent).toFixed(2)}</td>
              <td style={tdStyle}>{buyer.topCategory || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const thStyle = { border: '1px solid #ccc', padding: 10, background: '#f0f0f0' };
const tdStyle = { border: '1px solid #ccc', padding: 10 };

export default TopBuyers;
