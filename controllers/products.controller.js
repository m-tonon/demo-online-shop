const Product = require('../models/product.model');

async function getAllProducts(req, res, next) {
  let products;

  try {
    products = await Product.findAll();
    res.render('customer/products/all-products', { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

module.exports = {
  getAllProducts: getAllProducts,
}