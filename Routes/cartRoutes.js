const express = require('express');
const router = express.Router();
const { createCart, addToCart, removeProductCart, getCart } = require('../Controller/cartController');
const { adminAuth } = require('../Middleware/adminAuth');
const { userAuth } = require('../Middleware/userAuth');

router.post('/create', userAuth, createCart)
router.post('/add-product', userAuth, addToCart)
router.delete('/remove-product/:cartId/:productId', userAuth, removeProductCart)
router.get('/:cartId', userAuth, getCart)

module.exports = router;
