const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
//const multer  = require({dest: "uploads/"})
const path  = require("path")

//get users by id
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM Users WHERE userId=?", [req.params.id],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})


//get all users
router.get("",(req,res) =>{
    db.query("Select * from Users", (err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})

// GET /users/byemail/:email
router.get("/byemail/:email", (req, res) => {
    db.query("SELECT * FROM Users WHERE userEmail=?", [req.params.email],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})

// admin/DELETE /users/:id
router.delete("/:id", (req, res) => {
    db.query("update Users set status = 0 where userId = ?", [req.params.id],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.affectedRows !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess("User deleted"))
        }
    )
})

// PATCH /users/changepasswd
router.patch("/changepasswd", (req,res) => {
    const {userId,userPassword} = req.body
    //const encPasswd = bcrypt.hashSync(passwd, 10)
    db.query("UPDATE Users SET userPassword=? WHERE userId=?", [password, user_id],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.affectedRows !== 1)
                return res.send(apiError("User not found"))
            res.send(apiSuccess("User password updated"))
        }
    )
})


//Get User by a perticular address(Join with addresses table)
//get by city
router.get("/bycity/city/:city", (req, res) => {
    db.query("SELECT * FROM Users u join Addresses a on u.userId = a.userId  WHERE a.city=?", [req.params.city],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})


//get by Country
router.get("/bycountry//:country", (req, res) => {
    db.query("SELECT * FROM Users u join Addresses a on u.userId = a.userId  WHERE a.country=?", [req.params.country],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})

//by postal code
router.get("/postalcode///:postalCode", (req, res) => {
    db.query("SELECT * FROM Users u join Addresses a on u.userId = a.userId WHERE a.postal_code=?", [req.params.postalCode],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})

//by state
router.get("//:state", (req, res) => {
    db.query("SELECT * FROM Users u join join Addresses a on u.userId = a.userId  WHERE a.state=?", [req.params.state],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.length !== 1)
                return res.send(apiError("User not found"))
            return res.send(apiSuccess(result[0]))
        }
    )
})

module.exports = router