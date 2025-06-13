const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
//const multer  = require({dest: "uploads/"})
const path  = require("path")

//get users by id
router.get("/:id", (req, res) => {
    db.query("SELECT * FROM users WHERE user_id=?", [req.params.id],
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
    db.query("Select * from users", (err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})

// GET /users/byemail/:email
router.get("/byemail/:email", (req, res) => {
    db.query("SELECT * FROM users WHERE email=?", [req.params.email],
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
    db.query("DELETE FROM users WHERE user_id=?", [req.params.id],
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
    const {user_id, password} = req.body
    //const encPasswd = bcrypt.hashSync(passwd, 10)
    db.query("UPDATE users SET password=? WHERE user_id=?", [password, user_id],
        (err, result) => {
            if(err)
                return res.send(apiError(err))
            if(result.affectedRows !== 1)
                return res.send(apiError("User not found"))
            res.send(apiSuccess("User password updated"))
        }
    )
})

module.exports = router