const db = require("../utils/dbpool"); 
const { apiSuccess, apiError } = require("../utils/apiresult"); 
const express = require("express");
const router = express.Router();
const path = require("path"); 


router.post("/", (req, res) => {
    const {productId, wishListComment } = req.body;
    const userId = req.user.id
    db.query(
        "INSERT INTO WishLists(userId, productId, wishListComment) VALUES(?, ?, ?)",
        [userId, productId, wishListComment], 
        (err, result) => {
            if (err) 
                return res.send(apiError(err));
            if (result.affectedRows === 1) 
                 res.send(apiSuccess("Wishlist item added"));
            else res.send(apiError(err));
            
        }
    );
});

router.delete("/:wishListId", (req, res) => {
    const wishListId = req.params.wishListId
    const userId = req.user.id
    db.query(
        "DELETE FROM WishLists WHERE wishListId = ? and userId =?",
        [wishListId ,userId],
        (err, result) => {
            if (err) 
                return res.send(apiError(err));
            if (result.affectedRows === 1) 
                 res.send(apiSuccess("Wishlist item deleted"));
             else 
                 res.send(apiError("Wishlist item not found"));
            
        }
    );
});


router.get("/all", (req, res) => {
    const userId = req.user.id
    db.query("SELECT * FROM WishLists where userId= ?",[userId] ,(err, result) => {
        if (err) 
            return res.send(apiError(err));
        res.send(apiSuccess(result));
    });
});


router.get("/product/:productId", (req, res) => {
    const productId = req.params.productId
    db.query("SELECT * FROM WishLists WHERE productId = ?", [productId], (err, result) => {
        if (err) 
            return res.send(apiError(err));
        res.send(apiSuccess(result));
    });
});


module.exports = router;
