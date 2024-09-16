const express = require('express');
const { loginAdmin, createAdmin, allUsers, allOrders, updateOrderStatus } = require('../Controller/adminController');
const router = express.Router();

router.post("/signup",createAdmin);
router.post("/signin", loginAdmin)
router.get("/users", allUsers)
router.get('/orders', allOrders)
router.put('/orders/:orderId/:itemId', updateOrderStatus)

module.exports = router;