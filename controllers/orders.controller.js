const Order = require('../models/order.model');
const User = require('../models/user.model');

function getOrders(req,res) {
  res.render('customer/orders/all-orders');
}

async function addOrder (req, res, next) {
  const cart = res.locals.cart;

  let userDocument
  try {
    userDocument = await User.findById(res.locals.uid); // res.locals.uid from chech-auth middleware
  } catch (error) {
    next(error);
    return;
  }

  const order = new Order(cart, userDocument);

  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  req.session.cart = null; // reset the cart after buy

  res.redirect('/orders');
};

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder,
}
