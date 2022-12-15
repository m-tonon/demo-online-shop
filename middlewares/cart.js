// LOOK TO THE INCOMING REQUEST & CHECK IF IS COMMING FROM A USER THAT HAS OR NOT A CART
const Cart = require('../models/cart.model');

function initializeCart (req, res, next) {
  let cart;

  if (!req.session.cart) {
    cart = new Cart();
  } else {
    cart = new Cart(req.session.cart.items);
  }

  res.locals.cart = cart;

  next();
};

module.exports = initializeCart;