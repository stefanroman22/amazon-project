import { addToCart, cart, removeFromCart, updateDeliveryOption } from "../../data/cart.js";
import { products } from "../../data/products.js";
import { formatCurrency } from "../utils/money.js";
import { deliveryOptions, getDeliveryOption } from "../../data/deliveryOptions.js";
import dayjs from "https://unpkg.com/dayjs@1.11.18/esm/index.js";
import { renderPaymentSummary } from "./paymentSummary.js";

export function renderOrderSummary(){
let cartSummaryHTML = '';

cart.forEach(item => {
    const product = products.find(product => product.id === item.productId);
    const deliveryOptionId = item.deliveryOptionId;

    const deliveryOption = getDeliveryOption(deliveryOptionId);
    const today = dayjs();
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    cartSummaryHTML += 
    `<div class="cart-item-container js-cart-item-container js-cart-item-container-${product.id}">
            
            <div class="delivery-date">
              Delivery date: ${dateString}
            </div>

            <div class="cart-item-details-grid">
              <img class="product-image"
                src=${product.image}>

              <div class="cart-item-details">
                <div class="product-name">
                  ${product.name}
                </div>
                <div class="product-price">
                  $${formatCurrency(product.priceCents)}
                </div>
                <div class="product-quantity">
                  <span>
                    Quantity: <span class="quantity-label">${item.quantity}</span>
                  </span>
                  <span class="update-quantity-link link-primary js-update-quantity" data-cart-item='${JSON.stringify(item)}'>
                    Update
                </span>
                  <span class="delete-quantity-link link-primary js-delete-link js-delete-link-${product.id}" data-product-id="${product.id}">
                    Delete
                  </span>
                </div>
              </div>

              <div class="delivery-options">
                <div class="delivery-options-title">
                  Choose a delivery option:
                </div>
                ${deliveryOptionsHTML(product.id, item)}
              </div>


            </div>

          </div>`
});

function deliveryOptionsHTML(productId, cartItem) {
  let html = '';
  const today = dayjs();

  deliveryOptions.forEach((deliveryOption) => {
    const deliveryDate = today.add(deliveryOption.deliveryDays, 'days');
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryOption.priceCents === 0 
      ? 'Free' 
      : `$${formatCurrency(deliveryOption.priceCents)}`;

    const isChecked = deliveryOption.id === cartItem.deliveryOptionId;

    html += `
      <div class="delivery-option js-delivery-option" data-product-id="${productId}" data-delivery-option-id="${deliveryOption.id}">
        <input 
          type="radio"
          class="delivery-option-input"
          name="delivery-option-${productId}"
          ${isChecked ? 'checked' : ''}>
        <div>
          <div class="delivery-option-date">
            ${dateString}
          </div>
          <div class="delivery-option-price">
            ${priceString}
          </div>
        </div>
      </div>
    `;
  });

  return html;
}


document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;
document.querySelectorAll('.js-delete-link').forEach(link => {
    link.addEventListener('click', () => {
        const productId = link.dataset.productId;
        removeFromCart(productId);
        const container = document.querySelector(`.js-cart-item-container-${productId}`);
        container.remove();
        renderPaymentSummary();
    })
})

document.querySelectorAll('.js-delivery-option').forEach(option => {
  option.addEventListener('click', () => {
    const {productId, deliveryOptionId} = option.dataset
    updateDeliveryOption(productId, deliveryOptionId);
    renderOrderSummary();
    renderPaymentSummary();
  });
});

const elements = document.querySelectorAll('.js-update-quantity');

elements.forEach(element => {
  element.addEventListener('click', () => {
    // Check if there's already an input to avoid duplicates
    if (!element.querySelector('input')) {
      // Create input
      const inputElement = document.createElement('input');
      inputElement.style.width = '30px';
      inputElement.type = 'number';
      inputElement.min = '1';

      // Create save button
      const saveButton = document.createElement('button');
      saveButton.textContent = 'Save';
      saveButton.style.marginLeft = '5px';

      element.appendChild(inputElement);
      element.appendChild(saveButton);

      // Handle save button click
      saveButton.addEventListener('click', (event) => {
        

        const newQuantity = inputElement.value;
        const cartItem = JSON.parse(element.dataset.cartItem);

        // Example: update the cart
        addToCart(cartItem.productId, Number(newQuantity), true);

        // Re-render
        renderOrderSummary();
        renderPaymentSummary();
      });
      
    }
  });
});



}
