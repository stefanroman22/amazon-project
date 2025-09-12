export let cart;

loadFromStorage();
export function loadFromStorage(){
  cart = JSON.parse(localStorage.getItem('cart')) || [];
}
export function addToCart(productId, quantity = 1, changeQuantity = false){
  const index = cart.findIndex(product => product.productId === productId);
        if(index !== -1){
            if(!changeQuantity)
              cart[index].quantity += quantity;
            else cart[index].quantity = quantity;
        }else {
            cart.push({productId, quantity: quantity, deliveryOptionId: '1'});
        }
    saveToStorage();
}

function saveToStorage(){
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach(item => {
    if(item.productId !== productId){
      newCart.push(item);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function updateCartQuantity(){
  let cartQuantity = 0;
        cart.forEach(item => {
          cartQuantity += item.quantity;
        });
        document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;

  
}

export function updateDeliveryOption(productId, deliveryOptionId){

    let matchingItem;
  cart.forEach(item => {
    if(productId === item.productId){
      matchingItem = item;
    }
  });

  matchingItem.deliveryOptionId = deliveryOptionId;
  saveToStorage();

}

export function loadCart(fun) {
  const xhr = new XMLHttpRequest();

  xhr.addEventListener('load', () => {
    console.log(xhr.response);
    fun();
  });

  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();
}