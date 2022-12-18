const express = require('express');

const cartController = require('../controllers/cart.controller');

const router = express.Router();

router.get('/', cartController.getCart); // path will be /cart/

router.post('/items', cartController.addCartItem);

router.patch('/items', cartController.updateCartItem); // patch - when some of the data is updated

module.exports = router;
