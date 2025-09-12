import { renderOrderSummary } from "../scripts/checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import '../data/cart-oop.js';
import '../data/backend-practice.js';
import {loadProductsFetch} from "../data/products.js";
import { loadCart } from "../data/cart.js";


async function loadPage(){
    try{
        console.log('load page');

        await loadProductsFetch(); //wait here until loadProductsFetch() is finished

        await new Promise((resolve) => {
            loadCart(() => {
                resolve();
            });
        });

    }catch (error){
        console.log(error);
    }

    renderOrderSummary();
    renderPaymentSummary();
}

loadPage();

/*
Promise.all([
    new Promise((resolve) => { 
        loadProducts(() => {
            resolve('value');
        });
    }),
    new Promise((resolve) => {
        loadCart(() => {
            resolve();
        });
    }),

]).then((values) => {
    console.log(values);
    renderOrderSummary();
    renderPaymentSummary();
});
*/

/*
new Promise((resolve) => { 
    loadProducts(() => {
        resolve('value');
    });

}).then((value) => {
    console.log(value);
    return new Promise((resolve => {
        loadCart(() => {
            resolve();
    });
})).then(() => {
        renderOrderSummary();
        renderPaymentSummary();
    })
});
*/


