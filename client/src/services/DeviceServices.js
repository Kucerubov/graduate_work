import requestSend from "../http/index";

const DeviceServices = (function () {
    function DeviceServices() {}
    DeviceServices.Devices = function () {
        return new Promise((resolve) => {
            resolve(requestSend('GET', '/device', null))
        })
    };
    DeviceServices.DeviceID = function (id) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', `/device/${id}`, null));
        })
    };
    DeviceServices.addDevice = function (name, price, videoId, brandId, typeId, img, info) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', `/device`, {name: name, price: price, brandId: brandId, typeId: typeId, info: JSON.stringify(info), img: img}, true));
        })
    };
    return DeviceServices;

}());

export default DeviceServices;