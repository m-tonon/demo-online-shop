const db = require('../data/database');

class Order {
  // possible status => pending, fulfilled and cancelled
  constructor (cart, userData, status = 'pending', date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if(this.date) {
      this.formattedDate = this.date.toLocaleDateString('en-US', {
        weekday: 'short',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    }
    this.id = orderId;
  }

  save() {
    if (this.id) { // updating the order

    } else { // saving a new one
      const orderDocument = { // the data that will be store into the database
        userData: this.userData, // data from the user
        productData: this.productData, // from the product
        date: new Date(), // mongodb handle current date snapshot
        status: this.status
      };

      return db.getDb().collection('orders').insertOne(orderDocument); 
      // if there isnt nothing after no need async / await, just return
    }
  }
}

module.exports = Order;