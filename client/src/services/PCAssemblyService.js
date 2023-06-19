import requestSend from "../http/index";

const PCAssemblyService = (function () {
    function PCAssemblyService() {}
    PCAssemblyService.getPCAssembly = function (id) {
        return new Promise((resolve) => {
            resolve(requestSend('GET', `/assembly/${id}`, null), true)
        })
    };
    return PCAssemblyService;

}());

export default PCAssemblyService;