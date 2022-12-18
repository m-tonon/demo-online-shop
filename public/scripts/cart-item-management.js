const cartItemUpdateFormElements = document.querySelectorAll('.cart-item-management');

async function updateCartItem(event) {
  event.preventDefault();

  const form = event.target; // targeting the form which is trigging the event
  
  const productId = form.dataset.productid;
  const csrfToken = form.dataset.csrf;
  const quantity = form.firstElement.value;

  let response;

  try {
    response = await fetch('/cart/items', {
    method: 'PATCH',
    body: JSON.stringify({ // the 1st keys is the values cart.controller is trying to extract on updateItemData
      productId: productId, // for req.body.productId
      quantity: quantity,    // & for req.body.quantity
      _csrf: csrfToken
    }), 
    headers: {
      'Content-Type': 'application/json'
    }
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

};

for (const formElement of cartItemUpdateFormElements) {
  formElement.addEventListener('submit', updateCartItem);
};