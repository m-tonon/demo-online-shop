const addToCartButtonElement = document.querySelector('#product-details button');
const cartBadgeElement = document.querySelector('.nav-items .badge');

async function addToCart() {
  const productId = addToCartButtonElement.dataset.productid;
  const csrfToken = addToCartButtonElement.dataset.csrf;

  let response;
  try {
    response = await fetch('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        productId: productId,
        _csrf: csrfToken
      }),
      headers: { // extra metadata to be send
        'Content-Type': 'application/json' 
        // describes the type of data that will be send - this tells the browser 
        // that this is a json request and need to be parsed by the specific middleware
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

  const responseData = await response.json(); 
  // method that decodes the response data from the json to regular javascript

  const newTotalQuantity = responseData.newTotalItems;

  cartBadgeElement.textContent = newTotalQuantity;
};

addToCartButtonElement.addEventListener('click', addToCart);