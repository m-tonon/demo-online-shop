const User = require('../models/user.model');
const authUtil = require('../util/authentication');

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

async function login(req, res) {
  const user = new User(req.body.email, req.body.password); 
  const existingUser = await user.getUserWithSameEmail();

  if (!existingUser) {
    res.redirect('/login');
    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(existingUser.password);

  if (!passwordIsCorrect) {
    res.redirect('/login');
    return;
  }

  authUtil.createUserSession(req, existingUser, function() {
    res.redirect('/');
  })

}

function logout (req, res) {
  authUtil.destroyUserAuthSession(req);
  res.redirect('/login');
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
