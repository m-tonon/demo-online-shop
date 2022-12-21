const Product = require('./product.model');

class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) { 
    // a default value so if there isnt any on cart give an empty array
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
  }

  async updatePrices() { // keep the prices on the cart updated
    const productIds = this.items.map(function (item) { // create a new array (.map) with the product ids of the cart items
      return item.product.id; // the function will return the id of each item given, in the end its an array with product ids
    });

    const products = await Product.findMultiple(productIds); // method on product.model

    const deletableCartItemProductIds = []; // const helper for delete cart items

    for (const cartItem of this.items) { // loop for all the cart items
      const product = products.find(function (prod){ // & find the matching product from the db on the products const above
        return prod.id === cartItem.product.id; // prod is set automatically by JavaScript
      }); // then when the product that belong to the cart is found we proceed

      if(!product) { // not able to find - probably product was deleted 
        // --> "schedule" for removal from cart
        deletableCartItemProductIds.push(cartItem.product.id); // push the product id of the product that dont exists
        continue; // & continue to the next code outside the loop
      }

      // if product was not deleted then update the product data (total price from the latest price from db)
      cartItem.product = product; // overwrite the cart item product with the current product
      cartItem.totalPrice = cartItem.quantity * cartItem.product.price; // then update to the current price
    }

    if (deletableCartItemProductIds.length > 0) { // now this will delete the 'schedule' deletion
      this.items = this.items.filter(function (item) {
        return deletableCartItemProductIds.indexOf(item.product.id) < 0; 
        // indexOf search for a specific value in an array and return the index of it
        // returns -1 if dont find the index - thats why < 0
        // filter return true if cant find a product id 
        // & false if it can be found, then it will be dropped from the array
      });
    }

    // re-calculate cart totals after the deletion
    this.totalQuantity = 0;
    this.totalPrice = 0;

    for (const item of this.items) { // run to all the items and change the quantity & price
      this.totalQuantity = this.totalQuantity + item.quantity;
      this.totalPrice = this.totalPrice + item.totalPrice;
    }
  }

  addItem(product) {
    const cartItem = {
      product: product,
      quantity: 1,
      totalPrice: product.price
    };

    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (item.product.id === product.id) { // checks if the item added is already part of the cart
        cartItem.quantity = +item.quantity + 1; // using the current stored total quantity & price
        cartItem.totalPrice = item.totalPrice + product.price;
        this.items[i] = cartItem;

        this.totalQuantity++; // = this.totalQuantity + 1
        this.totalPrice += product.price; // = this.totalPrice + product.price
        return;
      }
    }

    this.items.push(cartItem); // if there isnt a cart yet, add the cartItem to it
    this.totalQuantity++;
    this.totalPrice += product.price;
  }

  updateItem(productId, newQuantity) {

    for (let i = 0; i < this.items.length; i++) { // loop for all the items from the cart
      const item = this.items[i];

      if (item.product.id === productId && newQuantity > 0) { // then check if the item.product.id matches the productId 'informed' & if its a positive number
        const cartItem = {...item}; // cartItem helper const which copy the item I found (const item above) and create a new cartItem
        const quantityChange = newQuantity - item.quantity; // the difference between the old and the new quantity (can be negative or positive)
        cartItem.quantity = newQuantity; // then set the new quantity from the input
        cartItem.totalPrice = newQuantity * item.product.price; // & multiplied by the new quantity
        this.items[i] = cartItem; // then replace the old cart item with that new item 

        this.totalQuantity = this.totalQuantity + quantityChange;
        this.totalPrice += quantityChange * item.product.price; // the older this.totalPrice + (quantityChange * product.price)
        return { updatedItemPrice: cartItem.totalPrice }; // returns the totalPrice saved to be used into the cart.controller

      } else if (item.product.id === productId && newQuantity <= 0) { // if quantity is negative
        this.items.splice(i, 1);// removes an item with a specific index & the number of items that should be removed
        this.totalQuantity -= item.quantity; 
        this.totalPrice -= item.totalPrice; 
        return { updatedItemPrice: 0 }; // removes the price
      }
    }
  }
};

module.exports = Cart;