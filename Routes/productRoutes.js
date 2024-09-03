const express = require('express');
const router = express.Router();
const productController = require('../Controller/productController');
const { adminAuth } = require('../Middleware/adminAuth');


router.get('/', productController.getAllProducts);
router.get('/category/:category', productController.getProductsByCategory);
router.get('/category/:category/:subcategory', productController.getProductsBySubCategory);
router.get('/:id', productController.getProductById);
router.post('/',adminAuth, productController.createProduct);
router.put('/:id',adminAuth, productController.updateProduct);
router.delete('/:id',adminAuth, productController.deleteProduct);

module.exports = router;
