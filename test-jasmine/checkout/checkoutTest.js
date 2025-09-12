import {renderOrderSummary} from "../../scripts/checkout/orderSummary.js";
import {loadFromStorage} from "../../data/cart.js";
import { loadProducts } from "../../data/products.js";

describe('test suite: renderOrderSummary', () => {

    beforeAll((done) => {
        loadProducts(() => {
            done();
        });
    });

    beforeEach(() => {
        spyOn(localStorage, 'setItem');
    });
    it('displays the cart', () => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary">
            </div>
        `;

        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                deliveryOptionId: '1',
            }]);
        });
        loadFromStorage();

        renderOrderSummary();
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(1);
        document.querySelectorAll('.js-order-summary').innerHTML = '';
    });

    it('removed a product', () => {
        document.querySelector('.js-test-container').innerHTML = `
            <div class="js-order-summary">
            </div>
            <div class="js-payment-summary">
            </div>
        `;
        let productId1 = 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6';
        spyOn(localStorage, 'getItem').and.callFake(() => {
            return JSON.stringify([{
                productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
                deliveryOptionId: '1',
            }]);
        });
        loadFromStorage();
        renderOrderSummary();
        document.querySelector(`.js-delete-link-${productId1}`).click();
        expect(document.querySelectorAll('.js-cart-item-container').length).toEqual(0);
    });
});