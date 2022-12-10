const Product = require('../models/product.model');

function getProducts (req, res) {
  res.render('admin/products/all-products');
};

function getNewProduct (req, res) {
  res.render('admin/products/new-product');
};

async function createNewProduct (req, res, next) {
  const product = new Product({
    ...req.body,
    image: req.file.filename // the .filename key that showed at console.log the new-product submit
  });

  try { // may fail, so try / catch
    await product.save() // this save to the database
  } catch (error) {
    next(error);
    return;
  }
  
  res.redirect('/admin/products');
};

module.exports = {
  getProducts: getProducts,
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
};