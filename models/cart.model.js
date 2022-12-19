class Cart {
  constructor(items = [], totalQuantity = 0, totalPrice = 0) { 
    // a default value so if there isnt any on cart give an empty array
    this.items = items;
    this.totalQuantity = totalQuantity;
    this.totalPrice = totalPrice;
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