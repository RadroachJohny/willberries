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
      modalClose = document.querySelector('.modal-close'),
      more = document.querySelector('.more'),
      navigationLink = document.querySelectorAll('[data-field]'),
      longGoodsList = document.querySelector('.long-goods-list'),
      cartTableGoods = document.querySelector('.cart-table__goods'),
      cartTableTotal = document.querySelector('.card-table__total'),
      cartCount = document.querySelector('.cart-count'),
      clearAll = document.querySelector('.clear-all');

const keyDownCheck = (e) => {  
    console.log(e.key);
    if (e.which === 27) {
      closeModal();
    }  
};

const getGoods = async function() {
  const result = await fetch('db/db.json');

  if(!result.ok) {
    throw 'Ошибка сервера: ' + result.status;
  }
  return await result.json();

};


const cart = {
  cartGoods: [
    // {id: '099', name: 'Часы Dior', price: 999, count: 2},
    // {id: '090', name: 'Кеды Вдики', price: 9, count: 3},
  ],
  renderCart() {
    console.log('rendering');
    cartTableGoods.textContent = '';
    // (({id, name, price, count}) - деструктурировали объкт
    this.cartGoods.forEach(({id, name, price, count}) => {
      const trGood = document.createElement('tr');
      trGood.className = 'cart-item';
      trGood.dataset.id = id;

      trGood.innerHTML = `
      <td>${name}</td>
      <td>${price}$</td>
      <td><button class="cart-btn-minus">-</button></td>
      <td>${count}</td>
      <td><button class="cart-btn-plus">+</button></td>
      <td>${price * count}$</td>
      <td><button class="cart-btn-delete">x</button></td>
      `;

      cartTableGoods.append(trGood);
    });

    const totalPrice = this.cartGoods.reduce((sum, item) => {
      return sum + item.price * item.count;
    }, 0);

    cartTableTotal.textContent = totalPrice + '$';

    console.log(this.cartGoods[0]);

  },
  deleteAllGoods() {
    this.cartGoods = [];
    this.renderCart();
    this.goodsCartAmount();
    console.log(this.cartGoods);
  },
  deleteGood(id) {
    this.cartGoods = this.cartGoods.filter((item) => {
      return item.id !== id;
    });
    this.goodsCartAmount();
    this.renderCart();
  },
  minusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        if (item.count <= 1) {
          this.deleteGood(id);
        } else {
          item.count--;
        }
        break;
      }
    }
    this.goodsCartAmount();
    this.renderCart();
  },
  plusGood(id) {
    for (const item of this.cartGoods) {
      if (item.id === id) {
        item.count++;
        break;
      }
    }
    this.renderCart();
    this.goodsCartAmount();
  },
  addCartGoods(id) {
    const goodItem = this.cartGoods.find(item => item.id === id);
    if (goodItem) {
      this.plusGood(id);
    } else {
      getGoods()
      .then(data => data.find(item => item.id === id))
      .then(({id, name, price }) => {
        this.cartGoods.push({
          id,
          name,
          price,
          count: 1,
          
        });
        
        this.goodsCartAmount();
      });
      

    }
   
  },
  goodsCartAmount() {
    
    console.log(888);
    const number = this.cartGoods.reduce((sum,item) => {
      return sum + item.count;
    },0);   
    cartCount.textContent = number ? number : '0';
    
  }
};


cart.goodsCartAmount();

document.body.addEventListener('click', (event) => {
  const addToCart = event.target.closest('.add-to-cart');
  if(addToCart) {
    cart.addCartGoods(addToCart.dataset.id);
  }
});

clearAll.addEventListener('click', () => {
  cart.deleteAllGoods()});

cartTableGoods.addEventListener('click', (event) => {
  const target = event.target;

  if (target.tagName === 'BUTTON') {
    const id = target.closest('.cart-item').dataset.id;

    if (target.classList.contains('cart-btn-delete')) {
      cart.deleteGood(id);
    };
    if (target.classList.contains('cart-btn-plus')) {
      cart.plusGood(id);
    };
    if (target.classList.contains('cart-btn-minus')) {
      cart.minusGood(id);
    };
  }
  
});

const openModal = () => {
  cart.renderCart();
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


more.addEventListener('click', (e) => {
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
  .then((data) =>data.filter((good) => good[field] === value))
  .then(renderCards);
};

navigationLink.forEach((link) => {
  link.addEventListener('click', function(e) {    
    e.preventDefault();
    console.log(link);
    const field = link.dataset.field;
    const value = link.tagName === 'BUTTON' ? link.value : link.textContent;
    filterCards(field, value);


  });
});




