document.addEventListener('DOMContentLoaded', () => {
  const CART_KEY = 'potlapalli_cart_v1';
  const cartContainer = document.getElementById('cartContainer');
  const totalItemsEl = document.getElementById('totalItems');
  const totalPriceEl = document.getElementById('totalPrice');

  const getCart = () => JSON.parse(localStorage.getItem(CART_KEY) || '{}');
  const saveCart = (c) => localStorage.setItem(CART_KEY, JSON.stringify(c));

  const renderCart = () => {
    const cart = getCart();
    cartContainer.innerHTML = ''; // clear previous
    let totalItems = 0;
    let totalPrice = 0;

    for (let key in cart) {
      const item = cart[key];
      totalItems += item.qty;
      totalPrice += item.qty * item.price;

      const div = document.createElement('div');
      div.classList.add('cart-item');
      div.innerHTML = `
        <img src="assets/images/${item.id.split('-')[0]}.jpg" alt="${item.name}">
        <div class="item-details">
          <h4>${item.name}</h4>
          <p>Price: ₹${item.price}</p>
          <div class="item-controls">
            <button class="minus">−</button>
            <input type="text" class="qty" value="${item.qty}" readonly>
            <button class="plus">+</button>
            <button class="remove">Remove</button>
          </div>
        </div>
        <div class="item-subtotal">Subtotal: ₹${item.qty * item.price}</div>
      `;
      cartContainer.appendChild(div);

      // Event listeners
      const minusBtn = div.querySelector('.minus');
      const plusBtn = div.querySelector('.plus');
      const qtyInput = div.querySelector('.qty');
      const removeBtn = div.querySelector('.remove');

      minusBtn.addEventListener('click', () => {
        if (item.qty > 1) {
          item.qty--;
          qtyInput.value = item.qty;
          saveCart(cart);
          renderCart();
        }
      });

      plusBtn.addEventListener('click', () => {
        item.qty++;
        qtyInput.value = item.qty;
        saveCart(cart);
        renderCart();
      });

      removeBtn.addEventListener('click', () => {
        delete cart[key];
        saveCart(cart);
        renderCart();
      });
    }

    totalItemsEl.textContent = totalItems;
    totalPriceEl.textContent = `₹${totalPrice}`;
  };

  renderCart();
});
