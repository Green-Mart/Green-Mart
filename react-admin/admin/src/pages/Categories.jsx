import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const CategoryAnalytics = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [topSalesCategory, setTopSalesCategory] = useState(null);
  const [highestProduct, setHighestProduct] = useState(null);
  const [productCountPerCategory, setProductCountPerCategory] = useState([]);

  useEffect(() => {
    fetchTopProducts();
    fetchTopSalesCategory();
    fetchHighestPricedProduct();
    fetchProductCountPerCategory();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const token = localStorage.getItem('Token');
      const res = await axios.get(`${BASE_URL}/admin/stats/category/top-products`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTopProducts(res.data.data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

    const fetchTopSalesCategory = async () => {
      try {
        const token = localStorage.getItem('Token');
        const res = await axios.get(`${BASE_URL}/admin/stats/category/top-sales`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTopSalesCategory(res.data.data);
      } catch (error) {
        console.error('Error:', error);
      }
    };

  const fetchHighestPricedProduct = async () => {
  try {
    const token = localStorage.getItem('Token');
    const res = await axios.get(`${BASE_URL}/admin/stats/category/highest-priced-product`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setHighestProduct(res.data.data);
  } catch (error) {
    console.error("Error fetching highest priced product:", error);
  }
};
  const fetchProductCountPerCategory = async () => {
  try {
    const token = localStorage.getItem('Token');
    const res = await axios.get(`${BASE_URL}/admin/stats/category/product-count`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setProductCountPerCategory(res.data.data);
  } catch (error) {
    console.error("Error fetching product count per category:", error);
  }
};

  return (
    <div style={styles.container}>
  <h2 style={styles.title}>Category Analytics</h2>

  {/* Row 1: Most Sold Product per Category */}
  <div style={styles.row}>
    <h3>Most Sold Product in Each Category</h3>
    <div style={styles.grid}>
      {topProducts.map(item => (
        <div key={item.productId} style={styles.card}>
          <h4>{item.categoryName}</h4>
          <p><strong>Product:</strong> {item.productName}</p>
          <p><strong>Total Sold:</strong> {item.totalSold}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Row 2: Most Sales Category */}
  {topSalesCategory && (
    <div style={styles.row}>
      <h3>Most Sales Category</h3>
      <div style={styles.card}>
        <p><strong>Category:</strong> {topSalesCategory.categoryName}</p>
        <p><strong>Total Revenue:</strong> ₹{topSalesCategory.totalRevenue}</p>
        <p><strong>Total Items Sold:</strong> {topSalesCategory.totalItemsSold}</p>
      </div>
    </div>
  )}

  {/* Row 3: Highest Priced Product */}
  {highestProduct && (
    <div style={styles.row}>
      <h3>Highest Priced Product</h3>
      <div style={styles.card}>
        <p><strong>Product:</strong> {highestProduct.productName}</p>
        <p><strong>Price:</strong> ₹{highestProduct.productPrice}</p>
        <p><strong>Category:</strong> {highestProduct.categoryName}</p>
      </div>
    </div>
  )}

  {/* Row 4: Product Count per Category Table */}
  {productCountPerCategory && (
    <div style={styles.row}>
      <h3>Product Count per Category</h3>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Product Count</th>
          </tr>
        </thead>
        <tbody>
          {productCountPerCategory.map((item, index) => (
            <tr key={index}>
              <td style={styles.td}>{item.categoryName}</td>
              <td style={styles.td}>{item.productCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )}
</div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    fontSize: '24px',
    marginBottom: '20px',
  },
  row: {
    marginBottom: '30px',
  },
  grid: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '15px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    width: '250px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    border: '1px solid #ccc',
    padding: '10px',
    backgroundColor: '#eee',
    textAlign: 'left',
  },
  td: {
    border: '1px solid #ccc',
    padding: '10px',
  },
};


export default CategoryAnalytics;
