const Product = require('../model/productModel');


exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
        products:products
  });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProductsByCategory = async (req, res) => {
  const { category } = req.params;
  const validCategories = ['men', 'women', 'kids'];

  if (!validCategories.includes(category.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  try {
    const products = await Product.find({ category: category.toLowerCase() }).sort({ createdAt: -1 });
    res.status(200).json({
        products:products
    }
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.createProduct = async (req, res) => {
  const { name, description, price, category, brand, sizes, colors, images, stock } = req.body;


  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }

  const product = new Product({
    name,
    description,
    price,
    category: category.toLowerCase(),
    brand,
    sizes,
    colors,
    images,
    stock,
  });

  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.updateProduct = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  if (updates.category) {
    const validCategories = ['men', 'women', 'kids'];
    if (!validCategories.includes(updates.category.toLowerCase())) {
      return res.status(400).json({ message: 'Invalid category' });
    }
    updates.category = updates.category.toLowerCase();
  }

  try {
    const updatedProduct = await Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json(updatedProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};


exports.deleteProduct = async (req, res) => {
  try {
    const deleted = await Product.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Product not found' });
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
