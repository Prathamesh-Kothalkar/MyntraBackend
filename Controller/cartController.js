const Cart = require('../model/CartModel');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("../config");

    const createCart = async (req, res) => {
    try {
      const userId = req.user._id;
      const newCart = new Cart({ userId });
      await newCart.save();
      res.status(201).json({ message: 'Cart created successfully', cart: newCart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create cart' });
    }
  };
  
    const addToCart =async (req, res) => {
    try {
      const cartId = req.body.cartId;
      const productId = req.body.productId;
      const quantity = req.body.quantity;
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      const existingProduct = cart.products.find(item => item.productId === productId);
      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
  
      await cart.save();
      res.status(200).json({ message: 'Product added to cart', cart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to add product to cart' });
    }
  };
  
    const removeProductCart = async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const productId = req.params.productId;
  
      const cart = await Cart.findById(cartId);
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
  
      cart.products = cart.products.filter(item => item.productId !== productId);
      await cart.save();
      res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove product from cart' });
    }
  };
  
  // Get a user's cart
//   router.get('/:cartId', userAuth, 
    const getCart =async (req, res) => {
    try {
      const cartId = req.params.cartId;
      const cart = await Cart.findById(cartId).populate('products.productId');
      if (!cart) {
        return res.status(404).json({ error: 'Cart not found' });
      }
      res.status(200).json({ cart });
    } catch (error) {
      res.status(500).json({ error: 'Failed to get cart' });
    }
  };
  
module.exports = { createCart, addToCart, removeProductCart, getCart };