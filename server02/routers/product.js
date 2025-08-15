const db = require("../utils/dbpool")
const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
const multer = require("multer");
const path  = require("path")


//all products
// app.use('/upload', express.static(path.join(__dirname, 'upload')));
router.get("/customer/allProducts",(req,res) =>{
    db.query("Select * from Products", (err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})

//by productid
router.get("/customer/get/by/pid/:productId" ,(req,res)=>{
    db.query("select * from products where productId = ?" ,[req.params.productId] ,(err,result)=>{
        if(err) return res.send(apiError(err))
        // console.log(result[0])
        res.send(apiSuccess(result[0]))
    })
})

//all categories
router.get("/customer/all/categories",(req,resp) =>{
    db.query("Select DISTINCT c.name from Products p join Categories c on c.categoryId = p.categoryId ", (err,result) => {
        if(err) return resp.send(apiError(err))
        const categories = result.map((obj) => obj.name)
        resp.send(apiSuccess(categories))
    })
})

//where category = ?
router.get("/customer/bycategory/:category" , (req,res) => {
    db.query("select * from Products p join Categories c on c.CategoryId = p.categoryId where c.categoryName = ?", [req.params.category] , (err,result) => {
            if(err) return res.send(apiError(err))
            res.send(apiSuccess(result))
    })
})

//where price = ?
router.get("/customer/byprice/price/:price" , (req,res) =>{
    db.query("select * from Products where productPrice = ?" ,[req.params.price] , (err,result)=>{
        if(err) return res.send(apiError(err))
        if (result.length === 0) res.send(apiError("no product found"));
		else res.send(apiSuccess(result));
    })
})


//where price between 
router.get("/customer/between/:price1/:price2/:category",(req, res) => {
    db.query("select * from Products p join Categories c on c.CategoryId = p.categoryId where p.productPrice between ? and ? and c.categoryName = ?" ,[req.params.price1 , req.params.price2 , req.params.category],(err,result)=>{
        if(err) return res.send(apiError(err))
        if (result.length == 0) res.send(apiError("no product in given range"))
        else res.send(apiSuccess(result))
    })
})



//where name = ?
router.get("/customer/allProducts/name//:name",(req,res) =>{
    db.query("Select * from Products where Name = ?",[req.params.name] ,(err,result) => {
        if(err) return res.send(apiError(err))
        res.send(apiSuccess(result))
    })
})

//admin
//add product
router.post("/admin", (req, resp) => {
    const { id, role } = req.user;
    console.log(req.user)
  
  if ( role !== 'admin') {
    return resp.status(403).send({ error: "Only admins can add products" });
  }
	const {categoryId,productName,productDescription,productPrice,productQuantity,productImageUrl } = req.body;
	db.query(
		"INSERT INTO products(categoryId,productName,productDescription,productPrice,productQuantity,productImageUrl ) VALUES(?, ?, ?, ?, ?,?)",
		[categoryId,productName,productDescription,productPrice,productQuantity,productImageUrl ],

		(err, result) => {
			if (err) return resp.send(apiError(err));
			// if INSERT is successful, fetch newly inserted record from db and return it
			if (result.affectedRows === 1) {
				db.query(
					"SELECT * FROM Products WHERE productId=?",
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
router.delete("/admin/:id", async (req, res) => {
  const { id, role } = req.user;
  if (role !== "admin") {
    return res.status(403).send({ error: "Only admins can delete products" });
  }
  const productId = req.params.id;
  try {
    // Delete from child tables first
    await db.promise().query("DELETE FROM orderitems WHERE productId = ?", [productId]);
    await db.promise().query("DELETE FROM cartitems WHERE productId = ?", [productId]);
    // Now delete from products
    db.query("DELETE FROM Products WHERE productId = ?", [productId], (err, result) => {
      if (err) return res.send(apiError(err));
      if (result.affectedRows === 1) res.send(apiSuccess({ message: "Product deleted" }));
      else res.send(apiError("product not found"));
    });
  } catch (err) {
    res.send(apiError(err));
  }
});


// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// Add Product Route
router.post('/admin/image/upload', upload.single('productImageUrl'), async (req, res) => {
  try {
    const { categoryId, productName, productDescription, productPrice, productQuantity } = req.body;
    const imagePath = req.file ? req.file.filename : null;

    await db.promise().query(
      'INSERT INTO products (categoryId, productName, productDescription, productPrice, productQuantity, productImageUrl) VALUES (?, ?, ?, ?, ?, ?)',
      [categoryId, productName, productDescription, productPrice, productQuantity, imagePath]
    );

    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});


router.get("/admin/all", (req, res) => {
    db.query("SELECT * FROM products p join categories c on p.categoryId = c.categoryId order by p.productId", (err, result) => {
        if (err) return res.send(apiError(err));
        res.send(apiSuccess(result));
    });
});

router.put("/admin/:productId", (req, res) => {
  const { role } = req.user;
  const { productId } = req.params;
  const { categoryId, productName, productDescription, productPrice, productQuantity, productImageUrl } = req.body;

  if (role !== 'admin') {
    return res.status(403).send({ error: "Only admins can edit products" });
  }

  db.query(
    "UPDATE products SET categoryId = ?, productName = ?, productDescription = ?, productPrice = ?, productQuantity = ?, productImageUrl = ? WHERE productId = ?",
    [categoryId, productName, productDescription, productPrice, productQuantity, productImageUrl, productId],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(200).json({ message: "Product updated successfully" });
    }
  );
});


module.exports = router;


//"Cannot delete or update a parent row: a foreign key constraint fails (`green_mart_project`.`orderitems`, CONSTRAINT `orderitems_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`productId`) ON DELETE RESTRICT ON UPDATE CASCADE)"