import requestSend from "../http/index";

const BasketServices = (function () {
    function BasketServices() {}
    BasketServices.addBasket = function () {
        return new Promise((resolve) => {
            resolve(requestSend('POST', '/add-basket', null))
        })
    };
    BasketServices.Basket = function (id) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', `/basket`, {basketId: id}));
        })
    };
    return BasketServices;

}());

export default BasketServices;