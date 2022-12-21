const Product = require('../models/product.model');

function getCart(req,res){
  res.render('customer/cart/cart');
}

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
  req.session.cart = cart;

  res.status(201).json({
    message: 'Cart updated!',
    newTotalItems: cart.totalQuantity,
  });
};

function updateCartItem (req, res) {
  const cart = res.locals.cart; // get access to the cart 

  const updatedItemData = cart.updateItem(
    req.body.productId, 
    +req.body.quantity) //method created at cart.model - update the cart item

  req.session.cart = cart // saves all into the session

  res.json({
    message: 'Item updated!',
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice, // a cart.controller property
    }
  })
};

module.exports = {
  getCart: getCart,
  addCartItem: addCartItem,
  updateCartItem: updateCartItem
}