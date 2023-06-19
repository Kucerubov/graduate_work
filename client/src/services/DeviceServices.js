import requestSend from "../http/index";

const DeviceServices = (function () {
    function DeviceServices() {}
    DeviceServices.Devices = function (brandId, typeId, limit, page) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', '/device',null, {brandId: brandId, typeId: typeId, limit: limit, page: page}))
        })
    };
    DeviceServices.DeviceID = function (id) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', `/device/${id}`, null));
        })
    };
    DeviceServices.addDevice = function (name, price, videoId, brandId, typeId, img, info) {
        return new Promise((resolve) => {
            resolve(requestSend('POST', `/device`, {name: name, price: price, brandId: brandId, typeId: typeId, info: JSON.stringify(info), img: img, videoId: videoId}, undefined, true));
        })
    };
    DeviceServices.DevicesInfo = function (typeId) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', '/device/withInfo',null, {typeId: typeId}))
        })
    };
    return DeviceServices;
}());

export default DeviceServices;