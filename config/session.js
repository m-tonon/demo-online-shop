const expressSession = require('express-session');
const mongoDbStore = require('connect-mongodb-session');

function createSessionStore () {
  const MongoDBStore = mongoDbStore(expressSession); // function to create a new mongodb store object

  const store = new MongoDBStore({// this constructor is provided by the connect-mongodb-session package
    uri: 'mongodb://127.0.0.1:27017',
    databaseName: 'online-shop',
    collection: 'sessions'
  }) 

  return store;
}

function createSessionConfig() { // this config is provide by express-session package
  return {
    secret: 'super-secret', //for securing the session
    resave: false, // ensure that the session is only saved is something changes
    saveUninitialized: false, // same above
    store: createSessionStore(),
    cookie: {
      maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days in miliseconds
    }
  };
}

module.exports = createSessionConfig;