import AuthService from "../services/AuthService";
import {makeAutoObservable} from "mobx";
import BasketServices from "../services/BasketServices";
import OtherService from "../services/OtherService";

export default class Store {

    constructor() {
        makeAutoObservable(this);
    }

    user = {};
    isAuth = false;

    basket = {};
    deviceInBasket = {};

    setDeviceInBasket(deviceInBasket){
        this.deviceInBasket = deviceInBasket;
        console.log(deviceInBasket);
    }

    setUser(user) {
        this.user = user;
    }

    setAuth(auth){
        this.isAuth = auth;
    }

    setBasket(basket){
        this.basket = basket;
        console.log(basket);
    }


    async login(email, password){
        const response = await AuthService.login(email, password);
        console.log(response);
        localStorage.setItem('token', response.accessToken);
        this.setUser(response.user);
        this.setBasket(response.basket.id);
        this.setAuth(response.user.isActivated);
    }

    async registration(username, email, password){
        try {
            const response = await AuthService.registration(username, email, password);
            console.log(response);
            localStorage.setItem('token', response.accessToken);
            this.setUser(response.user);
            this.setBasket(response.basket.id);
            this.setAuth(response.user.isActivated);
            return response;
        } catch (e){
            console.log(e);
        }
    }

    async logout() {
        try {
            const response = await AuthService.logout();
            console.log(response);
            localStorage.removeItem('token');
            this.setUser({});
            this.setAuth(false);
            this.setBasket({});
        } catch (e){
            console.log(e);
        }
    }

    async checkAuth() {
        try {
            const response = await AuthService.checkAuthentication();
            localStorage.setItem('token', response.accessToken);
            this.setUser(response.user);
            this.setBasket(response.basket.id);
            this.setAuth(response.user.isActivated);
        }catch (e) {
            console.log(e);
        }
    }

    async openBasket () {
        try {
            const response = await BasketServices.Basket(this.basket);
            this.setDeviceInBasket(response);
            console.log(response);
        }catch (e) {
            console.log(e);
        }
    }

    async addTypeBrand(marker, name) {
        try {
            const response = await OtherService.addTypeBrand(marker, name);
            console.log(response);
            return response;
        }catch (e){
            console.log(e);
        }
    }

    async addDeviceInBasket(deviceId){
        try {
            const response = BasketServices.addBasket(this.basket, deviceId);
            console.log(response);
        }catch (e) {
            console.log(e);
        }
    }

}