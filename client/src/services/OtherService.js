import requestSend from "../http/index";

const OtherService = (function () {
    function OtherService() {}
    OtherService.addTypeBrand = function (marker, name) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', `/${marker}`, {"name": name}, true))
        })
    };
    OtherService.allBrandType = function (marker) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', `/${marker}`, {marker}));
        })
    };
    return OtherService;

}());

export default OtherService;