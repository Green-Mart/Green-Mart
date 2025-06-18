const express = require('express')
const route = express.Router()
const { apiError } = require('../utils/apiresult');
const db = require('../utils/dbpool');
const { apiSuccess } = require('../utils/apiresult');

route.post('/', (req, res) => {
    const { userId, shippingAddressId, deliveryPartnerId, orderItems } = req.body;

    // Step 1: Validate request body
    if (!userId || !shippingAddressId || !deliveryPartnerId || !Array.isArray(orderItems) || orderItems.length === 0) {
        return res.send(apiError('Missing or invalid order details.'));
    }

    // Step 2: Check if deliveryPartnerId is a valid partner
    const checkDeliveryPartnerSql = `SELECT * FROM users WHERE userId = ? AND userRole = 'partner'`;
    db.query(checkDeliveryPartnerSql, [deliveryPartnerId], (err, result) => {
        if (err) return res.send(apiError(err));
        if (result.length === 0) return res.send(apiError('Invalid delivery partner ID.'));

        // Step 3: Calculate total order amount
        const totalAmount = orderItems.reduce((sum, item) => {
            return sum + item.itemQuantity * item.priceAtOrder;
        }, 0);

        // Step 4: Insert into orders table
        const orderSql = `
            INSERT INTO orders(userId, shippingAddressId, deliveryPartnerId, totalOrderAmount)
            VALUES (?, ?, ?, ?)
        `;
        db.query(orderSql, [userId, shippingAddressId, deliveryPartnerId, totalAmount], (err, orderResult) => {
            if (err) return res.send(apiError(err));

            const orderId = orderResult.insertId;
            console.log("Created Order ID:", orderId);

            // Step 5: Insert order items
            const itemSql = `
                INSERT INTO orderitems(orderId, productId, itemQuantity, priceAtOrder)
                VALUES ?
            `;
            const values = orderItems.map(item => [
                orderId,
                item.productId,
                item.itemQuantity,
                item.priceAtOrder
            ]);

            db.query(itemSql, [values], (err2) => {
                if (err2) return res.send(apiError(err2));

                // Step 6: Success response
                res.status(201).send(apiSuccess({
                    message: 'Order placed successfully',
                    orderId: orderId
                }));
            });
        });
    });
});




// 2. Get all orders
route.get('/', (req, res) => {
    db.query('SELECT * FROM orders', (err, rows) => {
        if (err) return res.send(apiError(err));
        res.send(apiSuccess(rows))
    });
});

// 3. Get order by ID with items
route.get('/:orderId', (req, res) => {
    const { orderId } = req.params;

    const orderSql = `SELECT * FROM orders WHERE orderId = ?`;
    const itemsSql = `SELECT * FROM orderitems WHERE orderId = ?`;

    db.query(orderSql, [orderId], (err, orderRows) => {
        if (err)
            return res.send(apiError(err));
        db.query(itemsSql, [orderId], (err2, itemRows) => {
            if (err2)
                return res.send(apiError(err2));
            res.send(apiSuccess({ orderRows, itemRows }))
        });
    });
});

// 4. Update order status
route.patch('/:orderId/status', (req, res) => {
    const { status } = req.body;
    const { orderId } = req.params;

    const sql = `UPDATE orders SET orderStatus = ? WHERE orderId = ?`;
    db.query(sql, [status, orderId], (err, Order) => {
        if (err)
            return res.send(apiError(err));
        const sql = `UPDATE orderitems SET itemStatus = ? WHERE orderId = ?`;
        db.query(sql, [status, orderId], (err, OrderItems) => {
            if (err)
                return res.send(apiError(err));
            res.send(apiSuccess({ Order, OrderItems }))
        })
    });
});

route.delete('/:orderId', (req, res) => {
    const { orderId } = req.params;

    const sql = `DELETE FROM orders WHERE orderId = ?`;
    db.query(sql, [orderId], (err) => {
        if (err)
            return res.send(apiError(err));
        const orderIns = `DELETE FROM orderitems WHERE orderId = ?`;
        db.query(orderIns, [orderId], (err1) => {
            if (err1)
                return res.send(apiError(err1));
            res.send(apiSuccess({ message: 'row deleted' }))
        });

    });
});

module.exports = route
