// pages/EditProduct.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
const BASE_URL = 'http://localhost:4000/product';

const EditProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState({
    categoryId: '',
    productName: '',
    productDescription: '',
    productPrice: '',
    productQuantity: '',
    productImageUrl: '',
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('Token');
      const res = await axios.get(`${BASE_URL}/customer/get/by/pid/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProductData(res.data.data);
    };

    fetchProduct();
  }, [productId]);

  const handleChange = (e) => {
    setProductData({ ...productData, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem('Token');
      await axios.put(`${BASE_URL}/admin/${productId}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Product updated successfully!');
      navigate('/dashboard/products');
    } catch (err) {
      alert('Error updating product');
      console.error(err);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Edit Product</h2>
      <input name="productName" value={productData.productName} onChange={handleChange} placeholder="Product Name" />
      <input name="productDescription" value={productData.productDescription} onChange={handleChange} placeholder="Description" />
      <input name="productPrice" value={productData.productPrice} onChange={handleChange} placeholder="Price" />
      <input name="productQuantity" value={productData.productQuantity} onChange={handleChange} placeholder="Quantity" />
      <input name="productImageUrl" value={productData.productImageUrl} onChange={handleChange} placeholder="Image URL" />
      <input name="categoryId" value={productData.categoryId} onChange={handleChange} placeholder="Category ID" />
      <button onClick={handleUpdate}>Update Product</button>
    </div>
  );
};

export default EditProduct;
