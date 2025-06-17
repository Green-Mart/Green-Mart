const exress = require('express');
const router = exress.Router();
const db = require('../utils/dbpool');
const { apiSuccess, apiError } = require('../utils/apiresult');

router.post('/insert', (req, resp) => {
    const { userId, productId, cartItemQuantity } = req.body;
    db.query('insert into cartitems(userId,productId,cartItemQuantity)values(?,?,?)',
        [userId, productId, cartItemQuantity],
        (err, result) => {
            if (err) {
                return resp.send(apiError(err))
            }
            else {
                if (result.affectedRows === 1) {
                    db.query('select * from cartitems where cartItemId=?', [result.insertId],
                        (err, result) => {
                            if (err) {
                                return resp.send(apiError(err))
                            }
                            else{
                                return resp.send(apiSuccess(result[0]))
                            }
                        })
                }
            }
        })
})
router.get("/:userId",(req,resp)=>{
     const userId=req.params.userId;
     db.query('select * from cartitems where userId=?',[userId],(err,result)=>{
        if(err)
            return resp.send(apiError(err))
        resp.send(apiSuccess(result))
     })
})

router.put("/:cartItemId", (req, resp) => {
    const cartItemQuantity = req.body.cartItemQuantity;
    const cartItemId = req.params.cartItemId;
    db.query('update cartitems set cartItemQuantity=? where cartItemId=?', [cartItemQuantity, cartItemId], (err, result) => {
        if (err)
            return resp.send(apiError(err));
        resp.send(apiSuccess(result));
    });
});

router.delete("/:cartItemId", (req, resp) => {
    const cartItemId = req.params.cartItemId;
    db.query('delete from cartitems where cartItemId=?', [cartItemId], (err, result) => {
        if (err)
            return resp.send(apiError(err));
        resp.send(apiSuccess(result));
    });
});

module.exports=router