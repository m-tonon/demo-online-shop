const deleteProductButtonElements = document.querySelectorAll('.product-item button');

async function deleteProduct (event) {
  const buttonElement = event.target; // the element that caused the event - the clicked button
  const productId = buttonElement.dataset.productid; // get from data- @ product-item.ejs
  const csrfToken = buttonElement.dataset.csrf;

  const response = await fetch('/admin/products/' + productId + '?_csrf=' + csrfToken, { 
    method: 'DELETE'
  }); 

  if (!response.ok) {
    alert('Something went wrong!');
    return;
  }

  // UPDATING THE DOM
  buttonElement.parentElement.parentElement.parentElement.parentElement.remove();
  // div-action.div-content.article.li
};

for (const deleteProductButtonElement of deleteProductButtonElements) {
  deleteProductButtonElement.addEventListener('click', deleteProduct);
}