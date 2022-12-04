const User = require('../models/user.model.js');

function getSignup(req, res) {
  res.render('customer/auth/signup');
}

async function signup(req, res) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city 
  );

  await user.signup() // stores the user into the database

  res.redirect('/login'); 
  // always redirect after a submit so if the user reload the page it wont try 
  // to send a request again
}

function getLogin(req, res) {
  res.render('customer/auth/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup
};
