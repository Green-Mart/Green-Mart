const { apiSuccess , apiError } = require("../utils/apiresult")
const express = require("express")
const router = express.Router();
const path  = require("path")
const db = require("../utils/dbpool")

router.post("/insert", (req, resp) => {
	const {categoryName,categoryDescription} = req.body;

	db.query(
		"INSERT INTO categories(categoryName,categoryDescription) VALUES(?, ?)",
		[categoryName,categoryDescription],
		(err, result) => {
			if (err) return resp.send(apiError(err));
			// if INSERT is successful, fetch newly inserted record from db and return it
			if (result.affectedRows === 1) {
				db.query(
					"SELECT * FROM categories WHERE categoryId=?",
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

module.exports = router;