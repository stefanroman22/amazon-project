function Cart(key){
    const cart = {
        cartItems: undefined,
        loadFromStorage(){
            this.cartItems = JSON.parse(localStorage.getItem(key)) || [];
        },
        addToCart(productId, quantity = 1, changeQuantity = false){
            const index = this.cartItems.findIndex(product => product.productId === productId);
            if(index !== -1){
                if(!changeQuantity)
                this.cartItems[index].quantity += quantity;
                else this.cartItems[index].quantity = quantity;
            }else {
                this.cartItems.push({productId, quantity: quantity, deliveryOptionId: '1'});
            }
            this.saveToStorage();
        },
        saveToStorage(){
            localStorage.setItem(key, JSON.stringify(this.cartItems));
        },
        removeFromCart(productId){
            const newCart = [];

            this.cartItems.forEach(item => {
                if(item.productId !== productId){
                    newCart.push(item);
                }
            });

            this.cartItems = newCart;
            this.saveToStorage();
        },
        updateCartQuantity(){
            let cartQuantity = 0;
            this.cartItems.forEach(item => {
                cartQuantity += item.quantity;
            });
            document.querySelector('.js-cart-quantity').innerHTML = cartQuantity;
        },
        updateDeliveryOption(productId, deliveryOptionId){

            let matchingItem;
            this.cartItems.forEach(item => {
                if(productId === item.productId){
                matchingItem = item;
                }
            });

            matchingItem.deliveryOptionId = deliveryOptionId;
            this.saveToStorage();

        }

    };
    return cart;
}
const cart = Cart('cart-oop');
cart.loadFromStorage();


