const express = require('express');
const { loginAdmin, createAdmin } = require('../Controller/adminController');
const router = express.Router();

router.post("/signup",createAdmin);
router.post("/signin",loginAdmin)

module.exports = router;