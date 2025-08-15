// components/ProductSearchFilter.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductSearchFilter = ({ onSearch }) => {
  const [searchText, setSearchText] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
        const token = localStorage.getItem('Token');
      const res = await axios.get('http://localhost:4000/category/admin/all',{
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setCategories(res.data.data); // Adjust key as per your API response
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleSearch = () => {
    onSearch(searchText, selectedCategory);
  };

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="Search product..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        style={styles.input}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
        style={styles.select}
      >
        <option value="">All Categories</option>
        {categories.map((cat) => (
          <option key={cat.categoryId} value={cat.categoryName}>{cat.categoryName}</option>
        ))}
      </select>

      <button onClick={handleSearch} style={styles.button}>Search</button>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '10px',
    marginBottom: '20px',
    alignItems: 'center'
  },
  input: {
    padding: '8px',
    fontSize: '14px',
    width: '200px'
  },
  select: {
    padding: '8px',
    fontSize: '14px'
  },
  button: {
    padding: '8px 16px',
    fontSize: '14px',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '4px'
  }
};

export default ProductSearchFilter;
