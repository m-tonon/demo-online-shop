function checkAuthStatus(req, res, next) {
  const uid = req.session.uid;  // stores the user id of the session

  if (!uid) { // if there isnt any
    return next();
  }
  
  res.locals.uid = uid; // make available in all the templates
  res.locals.isAuth = true;
  res.locals.isAdm = req.session.isAdm; // display isAdm the checking to the templates
  next();
}

module.exports = checkAuthStatus;