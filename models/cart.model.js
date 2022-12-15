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
      const items = this.items[i];
      if (item.product.id === product.id) { // checks if the item added is already part of the cart
        cartItem.quantity = cartItem.quantity + 1;
        cartItem.totalPrice = cartItem.totalPrice + product.price;
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
}

module.exports = Cart;