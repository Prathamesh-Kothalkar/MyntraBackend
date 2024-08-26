const express = require('express');
const router = express.Router();
const userController = require("../Controller/userController");

router.post("/signup",userController.createUser)
router.post("/signin",userController.loginUser)

module.exports = router;