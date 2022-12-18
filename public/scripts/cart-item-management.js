const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');
const cartTotalPriceElement = document.getElementById('cart-total-price'); 
const cartBadge = document.querySelector('.nav-items .badge'); 

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target; // targeting the form which is trigging the event
  
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElementChild.value;

  let response;

  try {
    response = await fetch('/cart/items', {
    method: 'PATCH',
    body: JSON.stringify({ // the 1st keys is the values cart.controller is trying to extract on updateItemData
      productId: productId, // for req.body.productId
      quantity: quantity,    // & for req.body.quantity
      _csrf: csrfToken,
    }), 
    headers: {
      'Content-Type': 'application/json',
    },
  });
  } catch (error) {
    alert('Something went wrong!');
    return;
  }

  if(!response.ok) {
    alert('Something went wrong!');
    return;
  }

  const responseData = await response.json(); // await to extract the response data

  if(responseData.updatedCartData.updatedItemPrice === 0) { // when the quantity is set to 0 the updatedItemPrice will be 0 
    form.parentElement.parentElement.remove();
  } else { // only perform these steps if the cart is still there
    const cartItemTotalPriceElement = 
      form.parentElement.querySelector('.cart-item-price'); 
    cartItemTotalPriceElement.textContent = 
      responseData.updatedCartData.updatedItemPrice.toFixed(2); // to change the item total price
  }


  cartTotalPriceElement.textContent = responseData.updatedCartData.newTotalPrice.toFixed(2);// change totalprice

  cartBadge.textContent = responseData.updatedCartData.newTotalQuantity; // change the badge
};

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
};