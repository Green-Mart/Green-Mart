import React, { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = 'http://localhost:4000';

const MostRatedProductsByCategory = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/admin/stats/reviews/most-rated-by-category`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('Token')}` },
      });
      setItems(response.data);
    } catch (err) {
      console.error('Error loading most-rated by category', err);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Top Reviewed Product in Each Category</h2>
      <div style={styles.cards}>
        {items.map((it) => {
          const id = it.productId + it.userId; // Assuming productId and userId are unique together
          return (
            <div key={id} style={styles.card}>
              <h3>{it.categoryName}</h3>
              {it.productId ? (
                <>
                  <p><strong>Product:</strong> {it.productName}</p>
                <p><strong>Total Reviews:</strong> {it.totalReviews}</p>
                <p><strong>Avg Rating:</strong> {it.averageRating}</p>
                <p><strong>Top Reviewer:</strong> {it.topReviewer}</p>
              </>
            ) : (
              <p>No reviews yet in this category</p>
            )}
          </div>
        )})}
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
  },
  title: {
    marginBottom: '16px',
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
  },
  card: {
    width: '280px',
    padding: '16px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
  },
};

export default MostRatedProductsByCategory;
