const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const {createToken} = require("../utils/jwtauth")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router();
//const multer  = require({dest: "uploads/"})
const path  = require("path");


router.get("",(req,res)=>{
    const userId = req.user.id
    db.query("select * from payments userId =?" , [userId] ,(err,result)=>{
        if(err) return res.send(apiError(err))
        return res.send(apiSuccess(result))
    })
})

router.post("",(req,res)=>{
    const {transactionId,orderId,paymentAmount,paymentMethod , paymentStatus} = req.body
    db.query("insert into payments (transactionId,orderId,paymentAmount,paymentMethod , paymentStatus) values(?,?,?,?,?)" ,
        [transactionId,orderId,paymentAmount,paymentMethod , paymentStatus] ,(err,result)=>{
                if(err) return res.send(apiError(err))
                if (result.affectedRows === 1) res.send(apiSuccess("payment done"));
		    else res.send(apiError(err));
        }
    )
})

module.exports = router