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

modalCart.addEventListener('click', function(e) {
  if(e.target === this) {
    closeModal();
  } 
});

modalClose.addEventListener('click', closeModal);

buttonCart.addEventListener('click', openModal);

const smoothScroll = (id) => {
  console.log(id);
  document.querySelector(id).scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

// scroll smooth
{const scrollLinks = document.querySelectorAll('a.scroll-link');

  for (const scrollLink of scrollLinks) {
    scrollLink.addEventListener('click', (e) => {
      e.preventDefault();
      console.log(this);
      const id = scrollLink.getAttribute('href');
      smoothScroll(id);
  
    });
  }
}

// GOODS
const more = document.querySelector('.more'),
      navigationLink = document.querySelectorAll('[data-field]'),
      longGoodsList = document.querySelector('.long-goods-list');

const getGoods = async function() {
  const result = await fetch('db/db.json');

  if(!result.ok) {
    throw 'Ошибка сервера: ' + result.status;
  }
  return await result.json();

};



const createCard = function({label, name, img, price, description, id}) {
  const card = document.createElement('div');
  card.className = 'col-lg-3 col-sm-6';

  // const {label, name, img, price, description, id} = objCard;

  card.innerHTML = `
  <div class="goods-card">
  ${label ? `<span class="label">${label}</span>` : ''}
    
    <img src="db/${img}" alt="${name}" class="goods-image">
    <h3 class="goods-title">Embroidered Hoodie</h3>
    <p class="goods-description">${description}</p>
    <button class="button goods-card-btn add-to-cart" data-id="007">
      <span class="button-price">$${price}</span>
    </button>
  </div>
  `;


  return card;
};

const renderCards = function(data) {
  longGoodsList.textContent = '';
  const cards = data.map(createCard);
  smoothScroll('#body');
  

    longGoodsList.append(...cards);
  document.body.classList.add('show-goods');
};


more.addEventListener('click', function(e) {
  e.preventDefault();
  smoothScroll('#body');
  getGoods().then(renderCards);
});

const filterCards = function(field, value) {
  if(value === 'All') {
    getGoods().then(renderCards);    
    return;
  }
  getGoods()
  .then(function(data) {
    
    const filteredGoods = data.filter(function(good) {
      return good[field] === value;
    });
    console.log(filteredGoods);
    return filteredGoods;
  })
  .then(renderCards);
} ;




navigationLink.forEach(function(link) {
  link.addEventListener('click', function(e) {
    
    e.preventDefault();
    console.log(link);
    const field = link.dataset.field;
    const value = link.tagName === 'BUTTON' ? link.value : link.textContent;
    filterCards(field, value);


  });
});




