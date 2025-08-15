const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
const path  = require("path")

//post review
router.post("/" , (req,res) =>{
    const {productId , reviewComment,productRating } = req.body;
    const userId = req.user.id
    console.log(req.user.id)
    db.query("insert into Reviews(userId, productId , reviewComment,productRating) values(?,?,?,?)" ,
         [ userId, productId , reviewComment,productRating] , (err,result) =>{
            if(err) return res.send(apiError(err))
            if (result.affectedRows >= 1) res.send(apiSuccess("review added"));
		    else res.send(apiError(err));
         })
})

//delete an review 
router.delete("/:pid", (req, res) => {
  const userId = req.user.id 
  const productId = req.params.pid;

  db.query(
    "DELETE FROM Reviews WHERE userId = ? AND productId = ?",
    [userId, productId],
    (err, result) => {
      if (err) return res.send(apiError(err));
      if (result.affectedRows === 1)
        res.send(apiSuccess("Review deleted"));
      else res.send(apiError("Review not found"));
    }
  );
});


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
router.patch("/:productId" , (req,res) =>{
    const { reviewComment, productRating } = req.body
    const userId = req.user.id
    console.log(req.body)
    db.query("update Reviews set reviewComment = ? , productRating = ? where userId =? and productId = ?" ,[reviewComment, productRating  ,userId ,req.params.productId] ,(err,result) =>{
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result));
    })
})

//get all reviews of a perticuar user/customer
router.get("/all/my/Review", (req, res) => {
  // if (!req.query.id) {
  //   return res.send(apiError("Missing user ID"));
  // }

  const userId = req.user.id;
  console.log("Checking userId:", userId);

  db.query("SELECT * FROM Reviews r join products p on r.productId = p.productId WHERE userId = ?", [userId], (err, result) => {
    if (err) return res.send(apiError(err));
    console.log("DB returned reviews:", result);
    res.send(apiSuccess(result));
  });
});


//get all reviews for a perticular product
router.get("/all/for/product/:productId" ,(req,res)=>{
    db.query("select * from Reviews where productId = ?" , [req.params.productId] , (err,result) =>{
        if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})

module.exports = router;