class Product {
  constructor(id, name, description, price, imageUrl) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.imageUrl = imageUrl;
  }
}

const products = [
  new Product(1, "Amethyst Ashes", "Amethyst Ashes is a smoky grey hair dye with cool purple tones. For the most radiant results, we recommend lightening hair to the lightest level 10 blonde before use. Pastels/Greys/Toners contain less pigment than our vivid shades and will fade from your hair faster.", 139, "../IMAGES/AmethystAshes.avif"),
  new Product(2, "Blue Panther Supernatural", "Blue Panther is a rich, deep violet-blue hair dye that embodies the deep hues of the supernatural. It offers a vibrant color that lasts long and stands out.", 189, "../IMAGES/BluePantherSupernatural.avif"),
  new Product(3, "Deadly Nightshade", "Beautiful and lethal, Deadly Nightshade is our darkest violet hair dye. It provides a deep, rich color that is perfect for those who want to make a bold statement.", 179, "../IMAGES/DeadlyNightshade.avif"),
  new Product(4, "Divine Wine", "This deep, red-based pink shade can be used from platinum blonde down to darkest brown, with results from a light berry wine all the way to deepest cab results. All semipermanent hair color works best on level 7+ pre-lightened hair. For a velvety, berry pink all the way to deepest burgundy results uses on darker bases.", 139, "../IMAGES/DivineWine.avif" ),
  new Product(5, "Electric Banana", "Electric Banana is a bright, neon yellow hair dye that reflects slightly green in sunlight and glows under blacklight! For the most vibrant results, we recommend lightening your hair to the lightest level 10 blonde before use.", 139, "../IMAGES/ElectricBanana.avif" )
];

document.addEventListener('DOMContentLoaded', () => {
  loadCartFromLocalStorage();
  updateCartIconQuantity();
  displayProducts(products);
  createModals(products);
  updateCart();
});


function loadCartFromLocalStorage() {
  const savedCart = localStorage.getItem('cart');
  if (savedCart) {
    cart = JSON.parse(savedCart);
    updateCart();
  }
}

function updateCartIconQuantity() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
  document.getElementById('cart-quantity').textContent = totalQuantity;
}

function displayProducts(products) {
  const container = document.querySelector('.products-container');
  products.forEach(product => {
    const productHTML = `
      <div class="col-12 col-sm-6 col-md-4">
        <article class="card" style="width: 100%; margin-top: 20px;">
          <img src="${product.imageUrl}" class="card-img-top" alt="${product.name}">
          <div class="card-body">
            <h5 class="card-title fw-bold">${product.name}</h5>
            <p class="card-text">${product.description.substring(0, 100)}...
              <a href="#" data-bs-toggle="modal" data-bs-target="#modalProduct${product.id}">Read more</a>
            </p>
            <p class="card-price bg-dark text-white p-2 text-center">${product.price}:-</p>
            <button class="btn btn-primary add-to-cart-btn" data-product-id="${product.id}" data-product-name="${product.name}" data-product-price="${product.price}">
              Add To Cart
            </button>
          </div>
        </article>
      </div>
    `;
    container.innerHTML += productHTML;
  });
}


function createModals(products) {
  products.forEach(product => {
    const modalHTML = `
      <div class="modal fade" id="modalProduct${product.id}" tabindex="-1" aria-labelledby="modalLabel${product.id}" aria-hidden="true">
        <div class="modal-dialog">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="modalLabel${product.id}">${product.name}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              ${product.description}
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.innerHTML += modalHTML;
  });
}

//--CART-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

let cart = [];


function addToCart(productId) {
  const product = products.find(p => p.id.toString() === productId);

  const productIndex = cart.findIndex(item => item.id === product.id);
  if (productIndex !== -1) {
    cart[productIndex].quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  updateCart();
  updateCartQuantity();
  updateCartTotal();
   saveCartToLocalStorage();
}

function updateCart() {
  const listCartElement = document.querySelector('.listCart');
  const emptyCartContainer = document.getElementById('empty-cart-container');
  listCartElement.innerHTML = '';

if (cart.length === 0) {
        // Varukorgen är tom
        emptyCartContainer.style.display = 'block';
        listCartElement.style.display = 'none';
    } else {
        // Varukorgen är inte tom
        emptyCartContainer.style.display = 'none';
        listCartElement.style.display = 'block'; 
    }


  cart.forEach(product => {
    const productElement = document.createElement('div');
    productElement.className = 'cart-item';

    // Container för bilden
    const imgContainer = document.createElement('div');
    imgContainer.className = 'img-container';
    const img = document.createElement('img');
    img.src = product.imageUrl;
    img.alt = product.name;
    img.className = 'cart-item-image';
    imgContainer.appendChild(img);

    // Container för namn och pris
    const textContainer = document.createElement('div');
    textContainer.className = 'text-container';
    const productName = document.createElement('div');
    productName.textContent = product.name;
    productName.className = 'product-name';
    const productPrice = document.createElement('div');
    productPrice.textContent = `${product.price} kr`;
    productPrice.className = 'product-price';
    textContainer.appendChild(productName);
    textContainer.appendChild(productPrice);

    // Container för kvantitetskontroller
    const quantityContainer = document.createElement('div');
    quantityContainer.className = 'quantity-container';
    quantityContainer.style.display = 'flex';
    quantityContainer.style.alignItems = 'center';

    const decreaseButton = document.createElement('button');
    decreaseButton.innerHTML = '&minus;';
    decreaseButton.className = 'decreaseQuantity round-button';
    decreaseButton.dataset.id = product.id;
    decreaseButton.onclick = () => decreaseQuantity(product.id);

    const quantityText = document.createElement('span');
    quantityText.textContent = ` ${product.quantity} `;

    const increaseButton = document.createElement('button');
    increaseButton.innerHTML = '&plus;'; // Använd HTML-entiteten för plus
    increaseButton.className = 'increaseQuantity round-button';
    increaseButton.dataset.id = product.id;
    increaseButton.onclick = () => increaseQuantity(product.id);

    quantityContainer.appendChild(decreaseButton);
    quantityContainer.appendChild(quantityText);
    quantityContainer.appendChild(increaseButton);

    // Container för totalpris
    const totalPriceContainer = document.createElement('div');

    totalPriceContainer.className = 'total-price-container';
    const totalPriceText = document.createElement('span');
    totalPriceText.innerHTML = `Totalt: ${product.price * product.quantity} kr`;
    totalPriceContainer.appendChild(totalPriceText);

    // Sammanfoga alla containers till produktElement
    productElement.appendChild(imgContainer);
    productElement.appendChild(textContainer);
    productElement.appendChild(quantityContainer);
    productElement.appendChild(totalPriceContainer);

    listCartElement.appendChild(productElement);

      updateCartQuantity(); // Uppdaterar kvantitetsvisningen
  updateCartTotal(); // Uppdaterar totalpriset
  });
}

document.querySelector('.products-container').addEventListener('click', function(event) {
  if (event.target.classList.contains('add-to-cart-btn')) {
    const productId = event.target.getAttribute('data-product-id');
    const productName = event.target.getAttribute('data-product-name');
    const productPrice = event.target.getAttribute('data-product-price');
    const imageUrl = event.target.getAttribute('data-product-image');

    addToCart(productId, productName, productPrice, imageUrl);
    updateCartIcon();
    showConfirmationModal(productName);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.add-to-cart-btn').forEach(button => {
    button.addEventListener('click', event => {
      const productId = button.getAttribute('data-product-id');
      addToCart(productId);
    });
  });
});

function increaseQuantity(productId) {
  const productIndex = cart.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity++;
    updateCart();
    updateCartQuantity();
    updateCartTotal();
    saveCartToLocalStorage();
  }
}

function decreaseQuantity(productId) {
  const productIndex = cart.findIndex(item => item.id === productId);
  if (productIndex !== -1) {
    cart[productIndex].quantity = Math.max(cart[productIndex].quantity - 1, 0);
    if (cart[productIndex].quantity === 0) {
      cart.splice(productIndex, 1);
    }
    updateCart();
    updateCartQuantity();
    updateCartTotal();
    saveCartToLocalStorage();
  }
}



function updateCartQuantity() {
  const cartQuantityElement = document.getElementById('cart-quantity');
  const totalQuantity = cart.reduce((total, product) => total + product.quantity, 0);
  cartQuantityElement.textContent = totalQuantity;
}



function updateCartTotal() {
  let total = 0;

  cart.forEach(product => {
    total += product.price * product.quantity;
  });

  const totalElement = document.querySelector('.cart-total-price');
  totalElement.textContent = `${total} :-`;
}


document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('.btn-checkout').addEventListener('click', function() {
    var checkoutModal = new bootstrap.Modal(document.getElementById('checkoutModal'), {});
    checkoutModal.show();

    cart = [];
    updateCart();
    updateCartTotal();
    document.getElementById('cart-quantity').textContent = '0';
  });
});


function saveCartToLocalStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

