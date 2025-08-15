const express = require('express');
const router = express.Router();
const db = require('../utils/dbpool');
const { apiSuccess, apiError } = require('../utils/apiresult'); 

// Get total users
router.get("/totalUsers",(req,res)=>{
  db.query("SELECT COUNT(*) AS totalUsers FROM users", (err, results) => {
    if (err) {
      console.error("Error fetching total users:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results[0]))
  });
})

router.get("/totalProducts",(req,res)=>{
  db.query("SELECT COUNT(*) AS totalProducts FROM products", (err, results) => {
    if (err) {
      console.error("Error fetching total products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results[0]))
  });
}
);


router.get("/totalCategories",(req,res)=>{
  db.query("SELECT COUNT(*) AS totalCategories FROM categories", (err, results) => {
    if (err) {
      console.error("Error fetching total categories:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results[0]))
  });
});


router.get("/totalOrders",(req,res)=>{
  db.query("SELECT COUNT(*) AS totalOrders FROM orders", (err, results) => {
    if (err) {
      console.error("Error fetching total orders:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results[0]))
  });
});

router.get("/totalCartItems",(req,res)=>{
  const userId = req.user.id;
  db.query("SELECT COUNT(*) AS totalCartItems FROM cartitems WHERE userId = ?", [userId], (err, results) => {
    if (err) {
      console.error("Error fetching total cart items:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results[0]))
  });
});

router.get("/monthlySales",(req,res)=>{
  db.query(
    "SELECT DATE_FORMAT(orderDate, '%b') AS month, SUM(totalOrderAmount) AS totalSales FROM orders GROUP BY DATE_FORMAT(orderDate, '%b') ORDER BY MIN(orderDate) DESC LIMIT 5",
    (err, results) => {
      if (err) {
        console.error("Error fetching monthly sales:", err);
        return res.status(500).json({ error: "Internal server error" });
      }
      return res.send(apiSuccess(results))
    }
  );
})

router.get("/topProducts",(req,res)=>{
  db.query("SELECT  p.productName, SUM(oi.itemQuantity) AS totalSold FROM products p JOIN orderitems oi ON p.productId = oi.productId GROUP BY p.productId ORDER BY totalSold DESC LIMIT 5", (err, results) => {
    if (err) {
      console.error("Error fetching top products:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    return res.send(apiSuccess(results))
  });
});

// routes/adminRoutes.js
router.get('/top-buyers', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        u.userId AS userId,
        u.userName,
        u.userEmail,
        SUM(oi.itemQuantity * p.productPrice) AS totalSpent,
        (
          SELECT c.categoryName 
          FROM orderItems oi2
          JOIN products p2 ON oi2.productId = p2.productId
          JOIN categories c ON p2.categoryId = c.categoryId
          WHERE oi2.orderId IN (
            SELECT orderId FROM orders WHERE userId = u.userId
          )
          GROUP BY c.categoryName
          ORDER BY SUM(oi2.itemQuantity) DESC
          LIMIT 1
        ) AS topCategory
      FROM users u
      JOIN orders o ON u.userId = o.userId
      JOIN orderItems oi ON o.orderId = oi.orderId
      JOIN products p ON oi.productId = p.productId
      WHERE u.userRole = 'customer'
      GROUP BY u.userId
      ORDER BY totalSpent DESC
      LIMIT 10;
    `);

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching top buyers' });
  }
});

router.get('/user-reviews/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const [reviews] = await db.promise().query(
      `SELECT r.userId, r.productRating, r.reviewComment, p.productName ,r.productId
       FROM reviews r
       JOIN products p ON r.productId = p.productId
       WHERE r.userId = ?`,
      [userId]
    );

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching user reviews:', err);
    res.status(500).json({ error: 'Failed to fetch user reviews' });
  }
});

// DELETE /admin/delete-review/:userId/:productId
router.delete('/delete-review/:userId/:productId', async (req, res) => {
  const { userId, productId } = req.params;

  try {
    await db.promise().query(
      'DELETE FROM reviews WHERE userId = ? AND productId = ?',
      [userId, productId]
    );
    res.json({ message: 'Review deleted' });
  } catch (err) {
    console.error('Error deleting review:', err);
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

router.get('/reviews/most-rated-by-category', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
     SELECT
  c.categoryId,
  c.categoryName,
  p.productId,
  p.productName,
  review_counts.totalReviews,
  ROUND(review_counts.avgRating, 2) AS averageRating,
  review_counts.topReviewer
FROM categories c
LEFT JOIN (
  SELECT
    p2.categoryId,
    r.productId,
    COUNT(*) AS totalReviews,
    AVG(r.productRating) AS avgRating,
    (
      SELECT userName
      FROM users
      WHERE userId = (
        SELECT userId
        FROM reviews
        WHERE productId = r.productId
        GROUP BY userId
        ORDER BY
          COUNT(*) DESC
        LIMIT 1
      )
    ) AS topReviewer
  FROM reviews r
  JOIN products p2
    ON r.productId = p2.productId
  GROUP BY
    p2.categoryId,
    r.productId
) AS review_counts
  ON review_counts.categoryId = c.categoryId
LEFT JOIN products p
  ON p.productId = (
    SELECT
      r.productId
    FROM reviews r
    WHERE
      r.productId IN (
        SELECT
          productId
        FROM products
        WHERE
          categoryId = c.categoryId
      )
    GROUP BY
      r.productId
    ORDER BY
      COUNT(*) DESC
    LIMIT 1
  )
WHERE
  c.categoryId IS NOT NULL;
    `);

    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching most-rated products by category' });
  }
});

router.get('/category/top-products', async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT 
        c.categoryId,
        c.categoryName,
        p.productId,
        p.productName,
        SUM(oi.itemQuantity) AS totalSold
      FROM categories c
      JOIN products p ON c.categoryId = p.categoryId
      JOIN orderItems oi ON p.productId = oi.productId
      GROUP BY c.categoryId, p.productId
      HAVING totalSold = (
        SELECT MAX(totalSold) FROM (
          SELECT SUM(oi2.itemQuantity) AS totalSold
          FROM products p2
          JOIN orderItems oi2 ON p2.productId = oi2.productId
          WHERE p2.categoryId = c.categoryId
          GROUP BY p2.productId
        ) AS categorySales
      )
    `);
    
    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching data' });
  }
});

router.get('/category/top-sales', async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT 
        c.categoryId,
        c.categoryName,
        SUM(oi.itemQuantity * p.productPrice) AS totalRevenue,
        SUM(oi.itemQuantity) AS totalItemsSold
      FROM categories c
      JOIN products p ON c.categoryId = p.categoryId
      JOIN orderItems oi ON p.productId = oi.productId
      GROUP BY c.categoryId
      ORDER BY totalRevenue DESC
      LIMIT 1
    `);
    
    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching top sales category' });
  }
});

router.get('/category/highest-priced-product', async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT 
        p.productName,
        p.productPrice,
        c.categoryName,
        c.categoryId
      FROM products p
      JOIN categories c ON p.categoryId = c.categoryId
      ORDER BY p.productPrice DESC
      LIMIT 1
    `);

    res.json({ success: true, data: result[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching highest priced product' });
  }
});

router.get('/category/product-count', async (req, res) => {
  try {
    const [result] = await db.promise().query(`
      SELECT 
        c.categoryId,
        c.categoryName,
        COUNT(p.productId) AS productCount
      FROM categories c
      LEFT JOIN products p ON c.categoryId = p.categoryId
      GROUP BY c.categoryId
    `);

    res.json({ success: true, data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error fetching product count per category' });
  }
});

// routes/adminAnalytics.js
router.get('/orders/summary', async (req, res) => {
  try {
    const [totalOrdersResult] = await db.promise().query(`
      SELECT COUNT(*) AS totalOrders FROM orders
    `);
      
    const [totalRevenueResult] = await db.promise().query(`
      SELECT SUM(oi.itemQuantity * p.productPrice) AS totalRevenue
      FROM orderItems oi
      JOIN products p ON oi.productId = p.productId
    `);

    const totalOrders = totalOrdersResult[0].totalOrders;
    const totalRevenue = totalRevenueResult[0].totalRevenue || 0;
    const averageOrderValue = totalOrders > 0 ? (totalRevenue / totalOrders).toFixed(2) : 0;

    const [ordersTodayResult] = await db.promise().query(`
      SELECT COUNT(*) AS ordersToday 
      FROM orders 
      WHERE DATE(orderDate) = CURDATE()
    `);

    res.json({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      ordersToday: ordersTodayResult[0].ordersToday
    });
  } catch (error) {
    console.error('Error fetching order summary:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET /admin/orders/sales-trend
router.get('/admin/orders/sales-trend', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        DATE(orderDate) as date,
        COUNT(*) as totalOrders,
        SUM(totalOrderAmount) as totalRevenue
      FROM orders
      WHERE orderDate >= CURDATE() - INTERVAL 30 DAY
      GROUP BY DATE(orderDate)
      ORDER BY date ASC
    `);

    res.json(rows);
  } catch (error) {
    console.error('Sales trend error:', error);
    res.status(500).json({ message: 'Error fetching sales trend data' });
  }
});

router.get('/orders/top-customers',async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        u.userId,
        u.userName,
        u.userEmail,
        COUNT(o.orderId) AS totalOrders,
        SUM(oi.itemQuantity * p.productPrice) AS totalSpent
      FROM
        orders o
        JOIN orderItems oi ON o.orderId = oi.orderId
        JOIN products p ON oi.productId = p.productId
        JOIN users u ON u.userId = o.userId
    GROUP BY
      o.userId
    ORDER BY
      totalSpent DESC
    LIMIT 5;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Top customers error:', error);
    res.status(500).json({ message: 'Error fetching top customers data' });
  }
});

router.get('/orders/most-popular-products', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT
      p.productId,
      p.productName,
      c.categoryName,
      SUM(oi.itemQuantity) AS quantitySold,
      SUM(oi.itemQuantity * p.productPrice) AS totalRevenue
    FROM
      orderItems oi
    JOIN products p ON p.productId = oi.productId
    JOIN categories c ON c.categoryId = p.categoryId
    GROUP BY
      oi.productId
    ORDER BY
      quantitySold DESC
    LIMIT 5;
    `);

    res.json(rows);
  } catch (error) {
    console.error('Most popular products error:', error);
    res.status(500).json({ message: 'Error fetching most popular products data' });
  }
});

router.get('/orders/category-distribution', async (req, res) => {
  try {
    const [rows] = await db.promise().query(`
      SELECT 
        c.categoryName,
        SUM(oi.itemQuantity * p.productPrice) AS totalRevenue
      FROM 
        orderItems oi
      JOIN products p ON p.productId = oi.productId
      JOIN categories c ON c.categoryId = p.categoryId
      GROUP BY 
        c.categoryName
    `);

    res.json(rows);
  } catch (error) {
    console.error('Category distribution error:', error);
    res.status(500).json({ message: 'Error fetching category distribution data' });
  }
});

module.exports = router;
