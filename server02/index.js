const express = require("express")
const app = express()
const productRouter = require("./routers/product")
const reviewRouter = require("./routers/review")
const userRouter = require("./routers/users")
const orderRouter = require("./routers/orders")
const categoryRouter = require("./routers/categories")
const cartIteam=require("./routers/cartItem")
const wishRoute= require("./routers/wishlist")
const payRoute= require("./routers/payment")
const adminStatsRoutes = require('./routers/adminStates');


const {jwtAuth} = require("./utils/jwtauth")


const cors  =require("cors")
app.use(cors())

app.use("/uploads", express.static("uploads"));
app.use(express.json());
app.use(jwtAuth);

app.use("/product", productRouter);
app.use("/review",reviewRouter);
app.use("/users",userRouter);
app.use("/orders",orderRouter);
app.use("/category",categoryRouter);
app.use("/cartitem",cartIteam);
app.use("/wishlist",wishRoute);
app.use("/payment",payRoute);
app.use('/admin/stats', adminStatsRoutes);

const port = 4000;
app.listen(port, "0.0.0.0", () => {
	console.log("server ready at port", port);
});
