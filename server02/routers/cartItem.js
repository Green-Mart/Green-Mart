const exress = require('express');
const router = exress.Router();
const db = require('../utils/dbpool');
const { apiSuccess, apiError } = require('../utils/apiresult');

router.post('/insert', (req, resp) => {
  const { productId, cartItemQuantity} = req.body;
  const userId = req.user.id
  // First check if product already exists in cart
  db.query(
    'SELECT * FROM cartitems WHERE userId = ? AND productId = ?',
    [userId, productId],
    (err, results) => {
      if (err) return resp.send(apiError(err));

      if (results.length > 0) {
        // Product already in cart, update quantity
        const existingItem = results[0];
        const newQuantity = existingItem.cartItemQuantity + cartItemQuantity;

        db.query(
          'UPDATE cartitems SET cartItemQuantity = ? WHERE cartItemId = ?',
          [newQuantity, existingItem.cartItemId],
          (err, result) => {
            if (err) return resp.send(apiError(err));
            return resp.send(apiSuccess({ ...existingItem, cartItemQuantity: newQuantity }));
          }
        );
      } else {
        // Product not in cart, insert new
        db.query(
          'INSERT INTO cartitems (userId, productId, cartItemQuantity) VALUES (?, ?, ?)',
          [userId, productId, cartItemQuantity],
          (err, result) => {
            if (err) return resp.send(apiError(err));
            db.query(
              'SELECT * FROM cartitems WHERE cartItemId = ?',
              [result.insertId],
              (err, result) => {
                if (err) return resp.send(apiError(err));
                return resp.send(apiSuccess(result[0]));
              }
            );
          }
        );
      }
    }
  );
});

router.get("/",(req,resp)=>{
     const userId = req.user.id
     db.query('SELECT cartitems.cartItemId, cartitems.cartItemQuantity, p.productName, p.productPrice, p.categoryId ,p.productId, p.productImageUrl FROM cartitems JOIN products p ON cartitems.productId = p.productId WHERE cartitems.userId = ?',[userId],(err,result)=>{
        if(err)
            return resp.send(apiError(err))
        resp.send(apiSuccess(result))
     })
})

router.put("/:cartItemId", (req, resp) => {
    const cartItemQuantity = req.body.cartItemQuantity;
    const cartItemId = req.params.cartItemId;
    const userId = req.user.id
    db.query('update cartitems set cartItemQuantity=? where cartItemId=? and userId = ?', [cartItemQuantity, cartItemId ,userId], (err, result) => {
        if (err)
            return resp.send(apiError(err));
        resp.send(apiSuccess(result));
    });
});

router.delete("/:cartItemId", (req, resp) => {
    const cartItemId = req.params.cartItemId;
    const userId = req.user.id
    db.query('delete from cartitems where cartItemId=? and userId = ?', [cartItemId , userId], (err, result) => {
        if (err)
            return resp.send(apiError(err));
        resp.send(apiSuccess(result));
    });
});


// DELETE /cartitem/clear
router.delete('/clear', async (req, res) => {
  const userId = req.user.id
  db.query('DELETE FROM CartItems WHERE userId = ?', [userId]);
  res.json({ status: 'success' });
});


module.exports=router