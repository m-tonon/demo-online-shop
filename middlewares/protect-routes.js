function protectRoutes(req, res, next) {
  if (!res.locals.isAuth) {
    return res.redirect('/401');
  }

  if (req.path.startsWith('/admin') && !res.locals.isAdm) { // startsWith built-in method
    return res.redirect('/403');
  }

  next();
}

module.exports = protectRoutes;
