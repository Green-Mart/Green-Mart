const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
const path  = require("path")

//post review
router.post("" , (req,res) =>{
    const { userId, productId , reviewComment,productRating } = req.body;
    db.query("insert into Reviews(userId, productId , reviewComment,productRating) values(?,?,?,?,?)" ,
         [ userId, productId , reviewComment,productRating] , (err,result) =>{
            if(err) return res.send(apiError(err))
            if (result.affectedRows === 1) res.send(apiSuccess("review added"));
		    else res.send(apiError(err));
         })
})

//delete an review 
router.delete("/:uid/:pid" ,(req,res) =>{
    db.query("delete from Reviews where userId=? and productId =?" ,[req.params.uid , req.params.pid ] , (err,result) =>{
        if(err) return res.send(apiError(err))
        if (result.affectedRows === 1) res.send(apiSuccess("review deleted"));
		else res.send(apiError("id not found"));
    })
})

//get all reviews
router.get("/all" , (req,res) =>{
    db.query("select * from Reviews" ,(err,result) =>{
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})


//get review by rating
router.get("/:rating" ,(req,res)=>{
    db.query("select * from Reviews where productRating = ?" , [req.params.rating] , (err,result) =>{
        if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})


//get reviews in rating range
router.get("/:rating1/:rating2" ,(req,res)=>{
    db.query("select * from Reviews where productRating between ? and ?" , [req.params.rating1, req.params.rating2] , (err,result) =>{
        if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})

//update review
router.patch("/:user_id//:product_id" , (req,res) =>{
    const { reviewComment, productRating } = req.body
    db.query("update Reviews set rReviewComment = ? , productRating = ? where userId =? and productId = ?" ,[reviewComment, productRating  ,req.params.user_id ,req.params.product_id] ,(err,result) =>{
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result));
    })
})

module.exports = router;