const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const {createToken} = require("../utils/jwtauth")
const bcrypt = require("bcrypt")
const express = require("express")
const router = express.Router();
//const multer  = require({dest: "uploads/"})
const path  = require("path")

// POST /users/signin
router.post("/signin", (req, resp) => {
    const { email, passwd } = req.body
    //console.log(req.url + " - " + req.method + " : " + email + " & " + passwd)
    db.query("SELECT * FROM users WHERE userEmail=?", [email],
        (err, results) => {
            if (err)
                return resp.send(apiError(err))
            //console.log("results: ", results)
            if (results.length !== 1) // user with email not found
                return resp.send(apiError("Invalid email"))
            const dbUser = results[0]
            const isMatching = bcrypt.compareSync(passwd, dbUser.userPassword)
            //console.log("is passwd matching: " , isMatching)
            if (!isMatching) // password not matching
                return resp.send(apiError("Invalid password"))
            // create jwt token and add it in response
            const token = createToken(dbUser)
            resp.send(apiSuccess({ ...dbUser, token })) // password matched for this user
        }
    )
})


// POST /users
router.post("/signup", (req, resp) => {
    const { name, email, passwd, mobile, role: inputRole } = req.body;
    const encPasswd = bcrypt.hashSync(passwd, 10);
    // Allowed roles as per ENUM in DB
    const allowedRoles = ["customer", "shopkeeper", "admin", "partner"];

    // If input role is valid, use it; else default to "customer"
    const role = allowedRoles.includes(inputRole) ? inputRole : "customer";
    const createdAt = new Date();

    db.query(
        "INSERT INTO users (userName, userEmail, userPassword, userPhone, userRole) VALUES (?, ?, ?, ?, ?)",
        [name, email, encPasswd, mobile, role],
        (err, result) => {
            if (err)
                return resp.send(apiError(err));

            if (result.affectedRows === 1) {
                db.query(
                    "SELECT * FROM users WHERE userId=?",
                    [result.insertId],
                    (err, results) => {
                        if (err)
                            return resp.send(apiError(err));
                        resp.send(apiSuccess(results[0]));
                    }
                );
            }
        }
    );
});


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