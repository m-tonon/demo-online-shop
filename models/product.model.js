const mongodb = require('mongodb');

const db = require('../data/database');

class Product {
  constructor(productData) {
    this.title = productData.title;
    this.summary = productData.summary;
    this.price = +productData.price; // '+' forces a conversion to number
    this.description = productData.description;
    this.image = productData.image; // the name of the image file
    this.imagePath = `product-data/images/${productData.image}`;
    this.imageUrl = `/products/assets/images/${productData.image}`; // request the image from the server
    // this '/products/assets' is used just for filtering the serving file @ app.js later
    // the advantage is that it dont give any hint of the structure we have on the server
    if (productData._id) { // stores the id if have one
      this.id = productData._id.toString();
    }
  }

  static async findById(productId) {
    let prodId

    try {
      prodId = new mongodb.ObjectId(productId)
    } catch (error) {
      error.code = 404;
      throw error;
    }

    const product = await db.getDb().collection('products').findOne({ _id: prodId});
    
    if(!product) {
      const error = new Error('Could not find product with provided id.');
      error.code = 404; // so later can be used to send back a responde 404 if have this error
      throw error;
    }

    return product;
  }

  static async findAll () { //to fetch a products list - static can be used itself
    const products = await db.getDb().collection('products').find().toArray(); 
    // toArray enforces return into an array

     // return products;
    return products.map(function(productDocument) { // to rebuilt the imagepath and imageurl 
      return new Product(productDocument);

      // transform all the documents fetched from the db into an object based on the blueprint
      // so did I do have imagePath & imageUrl that they didnt were stored with save()
    }); 
  }

  async save() {
    const productData = {
      title: this.title,
      summary: this.summary,
      price: this.price,
      description: this.description,
      image: this.image
    };

    await db.getDb().collection('products').insertOne(productData);
  } 

}

module.exports = Product;