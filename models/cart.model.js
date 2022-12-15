class Cart {
  constructor(items = []) { // a default value so if there isnt any on cart give an empty array
    this.items = items;
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
        return;
      }
    }
    
    this.items.push(cartItem);
  }
}