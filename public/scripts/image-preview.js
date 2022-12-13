const imagePickerElement = document.querySelector('#img-upload-control input');
const imagePreviewElement = document.querySelector('#img-upload-control img');

function updateImagePreview() {
  const files = imagePickerElement.files;

  if (!files || files.length === 0) {
    imagePreviewElement.style.display = 'none';
    return;
  }

  const pickedFile = files[0];

  imagePreviewElement.src = URL.createObjectURL(pickedFile); 
  // a built-in url class - generates an url for the object in the browser
  imagePreviewElement.style.display = 'block';
};

imagePickerElement.addEventListener('change', updateImagePreview);