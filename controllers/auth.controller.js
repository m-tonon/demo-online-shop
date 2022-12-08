const User = require('../models/user.model');
const authUtil = require('../util/authentication');
const validation = require('../util/validation');
const sessionFlash = require('../util/session-flash');

function getSignup(req, res) {
  res.render('customer/auth/signup');
}

async function signup(req, res, next) {
  const enteredData = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.fullname,
    street: req.body.street,
    postal: req.body.postal,
    city: req.body.city
  }

  if (
    !validation.userDetailsAreValid(
      req.body.email,
      req.body.password,
      req.body.fullname,
      req.body.street,
      req.body.postal,
      req.body.city
    ) ||
    !validation.emailIsConfirmed(req.body.email, req.body['confirm-email'])
  ) {
    sessionFlash.flashDataToSession(
      req,
      {
        errorMessage:
          'Please check your input. Password must be at least 6 characters long, postal code must be 5 characters long.',
        ...enteredData // take all the keys values and added here, in this object
      },
      function () {
        res.redirect('/signup');
      }
    );

    return;
  }

  const user = new User(
    req.body.email,
    req.body.password,
    req.body.fullname,
    req.body.street,
    req.body.postal,
    req.body.city
  );

  try {
    const existsAlready = user.existsAlready();

    if (existsAlready) {

      sessionFlash.flashDataToSession(req, {
        errorMessage: 'User exists already! Try loggin instead!',
        ...enteredData,
      },         
        function(){
        res.redirect('/signup');
      })

      return;
    }

    await user.signup(); // stores the user into the database
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

  const sessionErrorData = {
    errorMessage: 'Invalid credentials - please double-check your email and password',
    email: user.email,
    password: user.password
  }

  if (!existingUser) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function(){
      res.redirect('/login');
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(req, sessionErrorData, function(){
      res.redirect('/login');
    });

    return;
  }

  authUtil.createUserSession(req, existingUser, function () {
    res.redirect('/');
  });
}

function logout(req, res) {
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
