const stripe = require('stripe')('sk_test_51MIUKlLErrBUmWMGULRzuwoimb5TN3oTq2q3Im6sa7E0fID6mQpK31T1ufLOF948Qxn5XeKQTTiMgKM8dvuKOW0B00dJtPNLg0');

const Order = require('../models/order.model');
const User = require('../models/user.model');

async function getOrders(req,res) {
  try {
    const orders = await Order.findAllForUser(res.locals.uid); // show all the orders for a given user
    res.render('customer/orders/all-orders', {
      orders: orders
    });
  } catch (error) {
    next(error);
    return;
  }
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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Dummy'
          },
          unit_amount_decimal: 10.99
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `localhost:3000/orders/success`,
    cancel_url: `localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url);
};

function getSuccess(req, res){
  res.render('customer/orders/success');
}

function getFailure(req, res){
  res.render('customer/orders/failure');
}

module.exports = {
  getOrders: getOrders,
  addOrder: addOrder,
  getSuccess: getSuccess,
  getFailure: getFailure
}
