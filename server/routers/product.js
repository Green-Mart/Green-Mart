const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
//const multer  = require({dest: "uploads/"})
const path  = require("path")


//all products
router.get("/customer/allProducts",(req,res) =>{
    db.query("Select * from products", (err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})


//all categories
router.get("/customer/all/categories",(req,resp) =>{
    db.query("Select DISTINCT c.name from products p join categories c on c.category_id = p.category_id ", (err,result) => {
        if(err) return resp.send(apiError(err))
        const categories = result.map((obj) => obj.name)
        resp.send(apiSuccess(categories))
    })
})

//where category = ?
router.get("/customer/bycategory/:category" , (req,res) => {
    db.query("select * from products p join categories c on c.category_id = p.category_id where c.name = ?", [req.params.category] , (err,result) => {
            if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})

//where price = ?
router.get("/customer/byprice/price/:price" , (req,res) =>{
    db.query("select * from products where price = ?" ,[req.params.price] , (err,result)=>{
        if(err) return res.send(apiError(err))
        if (result.length === 0) res.send(apiError("no product found"));
		else res.send(apiSuccess(result[0]));
    })
})


//where price between 
router.get("/customer/between/:price1/:price2",(req, res) => {
    db.query("select * from products where price between ? and ? " ,[req.params.price1 , req.params.price2],(err,result)=>{
        if(err) return res.send(apiError(err))
        if (result.length == 0) res.send(apiError("no product in given range"))
        else res.send(apiSuccess(result))
    })
})



//where name = ?
router.get("/customer/allProducts/name//:name",(req,res) =>{
    db.query("Select * from products where name = ?",[req.params.name] ,(err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})

//admin
//add product
router.post("/admin", (req, resp) => {
	const { product_id,category_id,name,description,price,Quantity_iteam,image_url } = req.body;

	db.query(
		"INSERT INTO products(product_id,category_id,name,description,price,Quantity_iteam,image_url) VALUES(?, ?, ?, ?, ?,?,?)",
		[product_id,category_id,name,description,price,Quantity_iteam,image_url],
		(err, result) => {
			if (err) return resp.send(apiError(err));
			// if INSERT is successful, fetch newly inserted record from db and return it
			if (result.affectedRows === 1) {
				db.query(
					"SELECT * FROM products WHERE product_id=?",
					[result.insertId],
					(err, result) => {
						if (err) return resp.send(apiError(err));
						resp.send(apiSuccess(result[0]));
					}
				);
			}
		}
	);
});


//delete product
router.delete("/admin/:id" ,(req,res) =>{
        db.query("delete from products where product_id = ?" ,[req.params.id] , (err,result)=>{
            if(err) return res.send(err)
            if (result.affectedRows === 1) res.send(apiSuccess("Product deleted"));
		    else res.send(apiError("product not found"));
        })
})



module.exports = router;