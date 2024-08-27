const express=require('express');
const router=express.Router();
const userRouter=require("./user");
const productRouter=require("./productRoutes");
const adminRouter=require("./admin")
router.use("/user",userRouter);
router.use("/product",productRouter);
router.use("/admin",adminRouter);
module.exports = router;