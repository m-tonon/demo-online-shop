const Product = require('../models/product.model');

async function addCartItem (req, res, next) {
  let product;

  try {
    product = await Product.findById(req.body.productId); // to find a specific product to add to the cart
  } catch (error) {
    next(error);
    return;
  }

  const cart = res.locals.cart;

  cart.addItem(product);
  res.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity,
  });
};

module.exports = {
  addCartItem: addCartItem,
}