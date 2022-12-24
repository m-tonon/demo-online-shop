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
    line_items: cart.items.map(function (item) { // transform the items on cart into the stripe format required
      return {
        price_data: { // pass the cart data to stripe 
          currency: 'usd',
          product_data: {
            name: item.product.title
          },
          unit_amount: +item.product.price.toFixed(2) * 100 // the price its expressed in cents
        },
        quantity: item.quantity,
      }
    }),
    mode: 'payment',
    success_url: `http://localhost:3000/orders/success`,
    cancel_url: `http://localhost:3000/orders/failure`,
  });

  res.redirect(303, session.url); // redirect to stripes page where the customer will make the payment
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
