const express = require('express');
const { loginAdmin, createAdmin, allUsers, allOrders, updateOrderStatus, allProducts, addProducts, editProducts, deleteProduct } = require('../Controller/adminController');
const router = express.Router();

router.post("/signup",createAdmin);
router.post("/signin", loginAdmin)

router.get("/users", allUsers)
router.get('/orders', allOrders)
router.put('/orders/:orderId/:itemId', updateOrderStatus)


router.get('/products', allProducts)
router.post('/products/add', addProducts)
router.put('/products/:id', editProducts)
router.delete('/products/:id', deleteProduct)

module.exports = router;