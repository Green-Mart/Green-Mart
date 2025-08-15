import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ProductSearchFilter from '../components/productSearchFilter'; // Adjust path as needed

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const navigate = useNavigate();
  const BASE_URL = 'http://localhost:4000/product';

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('Token');
      const response = await axios.get(`${BASE_URL}/admin/all`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data.data || [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error.message);
    }
  };

  const handleDelete = async (productId) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    // debugger
    const token = localStorage.getItem('Token');
    const res = await axios.delete(`${BASE_URL}/admin/${productId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Product deleted:', res.data);
    alert('Product deleted successfully');
    fetchProducts(); // reload products list
  } catch (err) {
    alert('Error deleting product');
    console.error(err);
  }
};


  const handleSearch = (searchText, selectedCategory) => {
    const filtered = products.filter((product) => {
      const matchesSearch = product.productName
        .toLowerCase()
        .includes(searchText.toLowerCase());

      const matchesCategory =
        !selectedCategory || product.categoryName === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    setFilteredProducts(filtered);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Products</h2>

      <button style={styles.addButton} onClick={() => navigate('/dashboard/add-product')}>
        + Add Product
      </button>


      <ProductSearchFilter onSearch={handleSearch} />

      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>ID</th>
            <th style={styles.th}>Name</th>
            <th style={styles.th}>Category</th>
            <th style={styles.th}>Price</th>
            <th style={styles.th}>Stock</th>
            <th style={styles.th}>Actions</th>
            <th style={styles.th}>Image</th>
          </tr>
        </thead>
        <tbody>
          {filteredProducts.map((prod) => (
            <tr key={prod.productId}>
              <td style={styles.td}>{prod.productId}</td>
              <td style={styles.td}>{prod.productName}</td>
              <td style={styles.td}>{prod.categoryName}</td>
              <td style={styles.td}>₹{prod.productPrice}</td>
              <td style={styles.td}>{prod.productQuantity}</td>
              <td style={styles.td}>
                <button onClick={() => navigate(`/dashboard/edit-product/${prod.productId}`)} style={styles.editBtn}>
                  Edit
                </button>
                <button onClick={() => handleDelete(prod.productId)} style={{ marginLeft: '10px', color: 'red' }}>
                  Delete
                </button>
              </td>
              <td style={styles.td}>
              {prod.productImageUrl && (
                <img
                  src={`http://localhost:4000/uploads/${prod.productImageUrl}`}
                  alt={prod.productName}
                  width={50}
                  height={50}
                  style={{ objectFit: 'cover', borderRadius: '4px' }}
                />
              )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: 24,
  },
  heading: {
    fontSize: 24,
    marginBottom: 16,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: 12,
  },
  addButton: {
    padding: '8px 16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  th: {
    padding: 12,
    borderBottom: '2px solid #ccc',
    textAlign: 'left',
  },
  td: {
    padding: 10,
    borderBottom: '1px solid #eee',
  },
  editBtn: {
    marginRight: 8,
    padding: '4px 8px',
    backgroundColor: '#1976d2',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  deleteBtn: {
    padding: '4px 8px',
    backgroundColor: '#d32f2f',
    color: 'white',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
};

export default Products;
