const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
const path  = require("path")

//post review
router.post("" , (req,res) =>{
    const {review_id , user_id, product_id , review,rating } = req.body;
    db.query("insert into reviews(review_id ,user_id, product_id ,review ,rating) values(?,?,?,?,?)" ,
         [review_id , user_id, product_id , review,rating] , (err,result) =>{
            if(err) return res.send(apiError(err))
            if (result.affectedRows === 1) {
				db.query(
					"SELECT * FROM reviews WHERE review_id = ?",
					[result.insertId],
					(err, result) => {
						if (err) return res.send(apiError(err));
						res.send(apiSuccess(result[0]));
					}
				);
			}
         })
})

//delete an review 
router.delete("/:id" ,(req,res) =>{
    db.query("delete from reviews where review_id = ?" ,[req.params.id] , (err,result) =>{
        if(err) return res.send(apiError(err))
        if (result.affectedRows === 1) res.send(apiSuccess("review deleted"));
		else res.send(apiError("id not found"));
    })
})

//get all reviews
router.get("/all" , (req,res) =>{
    db.query("select * from reviews" ,(err,result) =>{
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})


//get review by rating
router.get("/:rating" ,(req,res)=>{
    db.query("select * from reviews where rating = ?" , [req.params.rating] , (err,result) =>{
        if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})


//get reviews in rating range
router.get("/:rating1/:rating2" ,(req,res)=>{
    db.query("select * from reviews where rating between ? and ?" , [req.params.rating1, req.params.rating2] , (err,result) =>{
        if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})

//update review
router.patch("/:user_id/:review_id/:product_id" , (req,res) =>{
    const { review, rating } = req.body
    db.query("update reviews set review = ? , rating = ? where user_id =? and review_id =? and product_id = ?" ,[review , rating ,req.params.user_id ,req.params.review_id ,req.params.product_id] ,(err,result) =>{
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result));
    })
})

module.exports = router;