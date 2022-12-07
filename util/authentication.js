function createUserSession(req, user, action) { 
  req.session.uid = user._id.toString(); // '.session' is avaliable by the express-session package
  req.session.save(action); // the action will be activated once the session is sucessfully saved 
}

module.exports = {
  createUserSession: createUserSession,
}