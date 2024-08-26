const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController");
const { userAuth } = require('../Middleware/userAuth');

router.post("/signup",userController.createUser);
router.post("/signin",userController.loginUser);
router.get("/profile",userAuth,userController.userProfile);

module.exports = router;