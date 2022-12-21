const mongodb = require('mongodb');

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

  static transformOrderDocument (orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments (orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() { // find all the orders
    const orders = await db
    .getDb()
    .collection('orders')
    .find()
    .sort({_id: -1})
    .toArray();

    return this.transformOrderDocument(orders);
  }

  static async findAllForUser(userId) {
    const uid = new mongodb.ObjectId(userId); // convert the userId to the mongodb object

    const orders = await db // get the orders from the db 
      .getDb()
      .collection('orders')
      .find({ 'userData._id': uid }) // filter the id from the userData and not the order object itself
      .sort({ _id: -1 }) // sort the query by id in descending order (the lastest added first) - mongodb sets a timestamp for each object stored
      .toArray();

    return this.transformOrderDocuments(orders); // then transform the data to the blueprint
  }

  static async findById(orderId) { // finding by id for adm interface
    const order = await db
    .getDb()
    .collection('orders')
    .findOne({ _id: new mongodb.ObjectId(orderId)}); // need convert the id to a mongodb object

    return this.transformOrderDocument(order);
  }

  save() {
    if (this.id) { // updating the order
      const orderId = new mongodb.ObjectId(this.id); // convert
      return db
      .getDb()
      .collection('orders')
      .updateOne({ _id: orderId}, { $set: {status: this.status} }); // the only update we want is the status
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