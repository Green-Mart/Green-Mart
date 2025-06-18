const exress = require('express');
const router = exress.Router();
const db = require('../utils/dbpool');
const { apiSuccess, apiError } = require('../utils/apiresult');

router.post('/insert', (req, resp) => {
    const {productId, cartItemQuantity } = req.body;
    const userId = req.user.id
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
router.get("/",(req,resp)=>{
     const userId=req.user.id;
     db.query('select * from cartitems where userId=?',[userId],(err,result)=>{
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

module.exports=router