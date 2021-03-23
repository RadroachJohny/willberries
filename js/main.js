const mySwiper = new Swiper('.swiper-container', {
	loop: true,

	// Navigation arrows
	navigation: {
		nextEl: '.slider-button-next',
		prevEl: '.slider-button-prev',
	},
});

// CART

const buttonCart = document.querySelector('.button-cart'),
      modalCart = document.getElementById('modal-cart'),
      modalClose = document.querySelector('.modal-close');

const keyDownCheck = (e) => {  
    console.log(e.key);
    if (e.which === 27) {
      closeModal();
    }  
};

const openModal = () => {
  modalCart.classList.add('show');
  document.addEventListener('keydown', keyDownCheck);
};

const closeModal = () => {
  modalCart.classList.remove('show');
  document.removeEventListener('keydown', keyDownCheck);
};

buttonCart.addEventListener('click', openModal);


// scroll smooth
const scrollLinks = document.querySelectorAll('a.scroll-link');

(function() {
  for (let i = 0; i < scrollLinks.length; i++) {
    scrollLinks[i].addEventListener('click', (e) => {
      e.preventDefault();
      const id = scrollLinks[i].getAttribute('href');
      document.querySelector(id).scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
  
    });
  }
})();



