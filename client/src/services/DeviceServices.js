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
    return DeviceServices;

}());

export default DeviceServices;