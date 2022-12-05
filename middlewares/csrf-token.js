function addCsrfToken(req, res, next) {
  res.locals.csrfToken = req.csrfToken(); // this method is avaliable by csurf package
  next(); // a function that fowards to the next middleware inline
}

module.exports = addCsrfToken;