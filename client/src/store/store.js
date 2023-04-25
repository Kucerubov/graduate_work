import AuthService from "../services/AuthService";
import {makeAutoObservable} from "mobx";

export default class Store {

    constructor() {
        makeAutoObservable(this);
    }

    user = {};
    isAuth = false;

    setUser(user) {
        this.user = user;
        console.log(user);
    }

    setAuth(auth){
        this.isAuth = auth;
    }


    async login(email, password){
        const response = await AuthService.login(email, password);
        console.log(response);
        localStorage.setItem('token', response.accessToken);
        this.setUser(response.user);
        this.setAuth(response.user.isActivated);
    }

    async registration(username, email, password){
        try {
            const response = await AuthService.registration(username, email, password);
            console.log(response);
            localStorage.setItem('token', response.accessToken);
            this.setUser(response.user);
            this.setAuth(response.user.isActivated);
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
        } catch (e){
            console.log(e);
        }
    }

    async checkAuth() {
        try {
            const response = await AuthService.checkAuthentication();
            localStorage.setItem('token', response.accessToken);
            this.setUser(response.user);
            this.setAuth(response.user.isActivated);
        }catch (e) {
            console.log(e);
        }
    }

}