const express=require('express');
const router=express.Router();
const userRouter=require("./user");
const productRouter=require("./productRoutes");
const adminRouter=require("./admin")
const homeRouter=require("./homeRouter");
const cartRouter=require("./cartRoutes");
const orderRouter = require("./orderRoutes");

router.use("/user",userRouter);
router.use("/product",productRouter);
router.use("/admin",adminRouter);
router.use("/home",homeRouter);
router.use("/cart",cartRouter);
router.use("/orders",orderRouter);

module.exports = router;