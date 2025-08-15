import React, { useState } from 'react';
import axios from 'axios';

const AddProduct = () => {
  const [formData, setFormData] = useState({
    categoryId: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productQuantity: '',
  });

  const [productImageUrl, setProductImageUrl] = useState(null);

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setMessage('');

  try {
    const token = localStorage.getItem('Token');
    const submitData = new FormData();

    // Append all text fields
    for (const key in formData) {
      submitData.append(key, formData[key]);
    }

    // Append image
    if (productImageUrl) {
      submitData.append('productImageUrl', productImageUrl);
    }

    const response = await axios.post('http://localhost:4000/product/admin/image/upload', submitData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });

    setMessage('Product added successfully!');
    setFormData({
      categoryId: '',
      productName: '',
      productDescription: '',
      productPrice: '',
      productQuantity: '',
    });
    setProductImageUrl(null);
  } catch (err) {
    setError(err.response?.data?.error || 'Something went wrong');
  }
};


  return (
    <div style={styles.container}>
      <h2>Add New Product</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="categoryId"
          placeholder="Category ID"
          value={formData.categoryId}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="text"
          name="productName"
          placeholder="Product Name"
          value={formData.productName}
          onChange={handleChange}
          style={styles.input}
        />
        <textarea
          name="productDescription"
          placeholder="Product Description"
          value={formData.productDescription}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="productPrice"
          placeholder="Price"
          value={formData.productPrice}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="number"
          name="productQuantity"
          placeholder="Quantity"
          value={formData.productQuantity}
          onChange={handleChange}
          style={styles.input}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setProductImageUrl(e.target.files[0])}
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Add Product</button>
        {message && <p style={styles.success}>{message}</p>}
        {error && <p style={styles.error}>{error}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '500px',
    margin: '30px auto',
    padding: '20px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    background: '#f9f9f9',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  button: {
    padding: '12px',
    fontSize: '16px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  success: {
    color: 'green',
    marginTop: '10px',
  },
  error: {
    color: 'red',
    marginTop: '10px',
  },
};

export default AddProduct;
