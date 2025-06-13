const express = require("express")
const app = express()
const productRouter = require("./routers/product")
const reviewRouter = require("./routers/review")
const userRouter = require("./routers/users")
//const {jwtAuth} = require("./utils/jwtauth")

const cors  =require("cors")
app.use(cors())

app.use(express.json());
//app.use(jwtAuth);
app.use("/product", productRouter);
app.use("/review",reviewRouter);
app.use("/users",userRouter);

const port = 4000;
app.listen(port, "0.0.0.0", () => {
	console.log("server ready at port", port);
});