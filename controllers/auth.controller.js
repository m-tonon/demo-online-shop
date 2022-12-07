const User = require('../models/user.model');
const authUtil = require('../util/authentication');

function getSignup(req, res) {
  res.render('customer/auth/signup');
}

async function signup(req, res, next) {
  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city 
  );

  try {
    await user.signup() // stores the user into the database
  } catch (error) {
    next(error); // this returns the default error handler, then it handle the 500 page
    return;
  }

  res.redirect('/login'); 
  // always redirect after a submit so if the user reload the page it wont try 
  // to send a request again
}

function getLogin(req, res) {
  res.render('customer/auth/login');
}

async function login(req, res, next) {
  const user = new User(req.body.email, req.body.password); 

  let existingUser; // needed to make the if condition for existingUser avaliable
  try {
    existingUser = await user.getUserWithSameEmail();
  } catch (error) {
    next(error);
    return;
  }

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
