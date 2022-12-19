const path = require('path');

const express = require('express');
const csrf = require('csurf');
const expressSession = require('express-session');

const createSessionConfig = require('./config/session');
const db = require('./data/database');
const addCsrfTokenMiddleware = require('./middlewares/csrf-token');
const errorHandlerMiddleware = require('./middlewares/error-handler');
const checkAuthStatusMiddleware = require('./middlewares/check-auth');
const protectRoutesMiddleware = require('./middlewares/protect-routes');
const cartMiddleware = require('./middlewares/cart');
const authRoutes = require('./routes/auth.routes');
const productsRoutes = require('./routes/products.routes');
const baseRoutes = require('./routes/base.routes');
const adminRoutes = require('./routes/admin.routes');
const cartRoutes = require('./routes/cart.routes');
const ordersRoutes = require('./routes/orders.routes');

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use('/products/assets', express.static('product-data')); // only request that starts with that filter (1st parameter)
app.use(express.urlencoded({extended: false})); // handle the form submit (e.g.'listen to req.body')
app.use(express.json()); // middleware built-it on express to parse json incoming request

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));
app.use(csrf()); // generates the csrf token and check incomming requests

app.use(cartMiddleware);

app.use(addCsrfTokenMiddleware); // distributes the generated token to all templates
app.use(checkAuthStatusMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productsRoutes);
app.use('/cart', cartRoutes);
app.use(protectRoutesMiddleware);
app.use('/orders', ordersRoutes);
app.use('/admin', adminRoutes); // path that starts with '/admin'

app.use(errorHandlerMiddleware);

db.connectToDatabase()
  .then(function(){
    app.listen(3000);
  })
  .catch(function (error) {
    console.log('Failed to connect to the database!');
    console.log(error);
  });