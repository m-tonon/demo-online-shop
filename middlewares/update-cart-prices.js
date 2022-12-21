async function updateCartPrices(req, res, next) {
  const cart = res.locals.cart; // get my cart from the session

  await cart.updatePrices(); // call the method from cart.model and await

  // req.session.cart = cart;
  next();
}

module.exports = updateCartPrices;