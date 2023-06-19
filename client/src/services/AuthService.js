import requestSend from "../http/index";

const AuthService = (function () {
    function AuthService() {}
    AuthService.login = function (email, password) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', '/login', { email: email, password: password }))
        })
    };
    AuthService.registration = function (username, email, password) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', '/registration', { username: username, email: email, password: password }))
        })
    };

    AuthService.logout = function () {
        return new Promise((resolve) => {
            resolve(requestSend('POST', '/logout', { username: 'aleha'}))
        })
    };

    AuthService.checkAuthentication = function () {
        return new Promise((resolve) => {
            resolve(requestSend('GET', '/refresh',null,  undefined, true))
        })
    };

    return AuthService;

}());

export default AuthService;
