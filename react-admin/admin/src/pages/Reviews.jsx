// pages/admin/AdminUserReviews.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import MostRatedProducts from './MostRatedProduct';

const BASE_URL = 'http://localhost:4000'; // Adjust based on your API base URL

const Reviews = () => {
  const { userId } = useParams();
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      // debugger
      const res = await axios.get(`${BASE_URL}/admin/stats/user-reviews/${userId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}` // Adjust based on your auth storage
        }
      });
      setReviews(res.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${BASE_URL}/admin/stats/delete-review/${userId}/${productId}`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("Token")}` // Adjust based on your auth storage
        }
      });
      setReviews(reviews.filter((r) => r.productId !== productId));
    } catch (err) {
      console.error('Error deleting review:', err);
    }
  };


  return (
    <div style={{ padding: 20 }}>
      <h2>User Reviews</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Product</th>
            <th style={thStyle}>Rating</th>
            <th style={thStyle}>Comment</th>
            <th style={thStyle}>Action</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((review) => {
            const id = review.productId + review.userId; // Assuming productId and userId are unique together
            return (
              <tr key={id}>
                <td style={tdStyle}>{review.productName}</td>
                <td style={tdStyle}>{review.productRating}</td>
                <td style={tdStyle}>{review.reviewComment}</td>
                <td style={tdStyle}>
                  <button onClick={() => handleDelete(review.productId)}>Delete</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <MostRatedProducts />
    </div>
  );
};

const thStyle = {
  border: '1px solid #ccc',
  padding: '8px',
  textAlign: 'left',
  backgroundColor: '#f2f2f2',
};

const tdStyle = {
  border: '1px solid #ccc',
  padding: '8px',
};

export default Reviews;
