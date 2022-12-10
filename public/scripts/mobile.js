const mobileMenuBtnElement = document.getElementById('mobile-menu-btn');
const mobileMenuElement = document.getElementById('mobile-menu');

function toggleMobileMenu() {
  // mobileMenuElement.style.display = 'block'
  mobileMenuElement.classList.toggle('open') // '.toggle' remove if exists or add if doesn't
}

mobileMenuBtnElement.addEventListener('click', toggleMobileMenu);