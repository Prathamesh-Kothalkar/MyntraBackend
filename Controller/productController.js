const esClient = require('../elasitcsrh');
const Product = require('../model/productModel');
const cloudinary = require('cloudinary').v2;
const subCategories = {
  men: ['shirts', 'trousers', 'shoes'],
  women: ['dresses', 'handbags', 'shoes'],
  kids: ['toys', 'clothing', 'shoes'],
};
cloudinary.config({
  cloud_name: 'dumjtp23d',
  api_key: '937132914545171',
  api_secret: 'YqFVbh9ZLliHcMTc9Fu6BrbstD4',
});
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

exports.getProductsBySubCategory = async (req, res) => {
  const { category, subcategory } = req.params;
  const validCategories = ['men', 'women', 'kids'];
  const subCategories = {
    men: ['shirts', 'trousers', 'shoes'],
    women: ['dresses', 'handbags', 'shoes'],
    kids: ['toys', 'clothing', 'shoes'],
  };

  if (!validCategories.includes(category.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  if (!subCategories[category.toLowerCase()]?.includes(subcategory.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid subcategory' });
  }

  try {
    const products = await Product.find({
      category: category.toLowerCase(),
      subCategory: subcategory.toLowerCase(),
    }).sort({ createdAt: -1 });

    if(products.length==0){
      return res.json({
        message:"Item not Found"
      })
    }

    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getProductsBySubCategory = async (req, res) => {
  const { category, subcategory } = req.params;
  const validCategories = ['men', 'women', 'kids'];

  if (!validCategories.includes(category.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid category' });
  }

  if (!subCategories[category.toLowerCase()]?.includes(subcategory.toLowerCase())) {
    return res.status(400).json({ message: 'Invalid subcategory' });
  }

  try {
    const products = await Product.find({
      category: category.toLowerCase(),
      subCategory: subcategory.toLowerCase(),
    }).sort({ createdAt: -1 });
    res.status(200).json({ products });
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
  const { name, description, price, category,subCategory, brand, sizes, colors, stock } = req.body;
  try {

  if (!name || !price || !category) {
    return res.status(400).json({ message: 'Name, price, and category are required' });
  }
  const uploadPromises = req.files.map(file=>
    cloudinary.uploader.upload(file.path,{
            folder:"ecomStore/products"
    }).then(result=>({result})).catch(error=>({error,filePath:file.path}))
)
const results = await Promise.all(uploadPromises);
const images = results.map(({result})=>result.secure_url);
  const product = new Product({
    name,
    description,
    price,
    category: category.toLowerCase(),
    subCategory: subCategory.toLowerCase(),
    brand,
    sizes,
    colors,
    images,
    stock,
  });

    const newProduct = await product.save();
    await esClient.index({
      index: 'products',
      id: newProduct._id.toString(), // Using MongoDB _id as Elasticsearch document id
      body: {
          name: newProduct.name,
          description: newProduct.description,
          price: newProduct.price,
          category: newProduct.category,
          subCategory: newProduct.subCategory,
          sizes: newProduct.sizes,
          colors: newProduct.colors,
          stock: newProduct.stock,
          images: newProduct.images,
          createdAt: newProduct.createdAt
      }
  });
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
exports.searchProduct = async (req, res) => {
  const query = req.query.q || '';
  try {
    const result = await esClient.search({
      index: 'products', // The Elasticsearch index name
      body: {
          query: {
              multi_match: {
                  query: query,
                  fields: ['name', 'description', 'category','subCategory', 'sizes', 'colors'] // Now searching in sizes and colors too
              }
          }
      }
  });

      const products = result.hits.hits.map(hit => hit._source); // Get the products from the search result
      res.json(products);
  } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'An error occurred while searching for products' });
  }
}


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
