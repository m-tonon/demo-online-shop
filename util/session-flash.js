function getSessionData(req) {
  const sessionData = req.session.flashedData;

  req.session.flashedData = null;

  return sessionData;
}

function flashDataToSession(req, data, action) {
  req.session.flashedData = data; // 'flashedData' is a key inside session created by calling it
  req.session.save(action); // execute that action once save is suceeded
}

module.exports = {
  getSessionData: getSessionData,
  flashDataToSession: flashDataToSession,
};
