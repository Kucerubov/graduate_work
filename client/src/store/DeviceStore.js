import DeviceServices from "../services/DeviceServices";
import {makeAutoObservable} from "mobx";
import OtherService from "../services/OtherService";

export default class DeviceStore {

    constructor() {
        makeAutoObservable(this);
    }

    device;
    devices;

    brand = null;
    type = null;

    setBrand(brand) {
        this.brand = brand;
    }

    setType(type) {
        this.type = type;
    }

    setDevice(device) {
        this.device = device;
    }

    setDevices(devices){
        this.devices = devices;
    }


    async getDevices(){
         try {
             const response = await DeviceServices.Devices();
             console.log(response);
             this.setDevices(response);
         } catch (e){
             console.log(e);
         }
    }

    async getDeviceID(id) {
        try {
            const response = await DeviceServices.DeviceID(id);
            console.log(response);
            this.setDevice(response);
        } catch (e) {
            console.log(e);
        }
    }

    async addDevice(name, price, videoId, brandId, typeId, img, info){
        try {
            const response = await DeviceServices.addDevice(name, price, videoId, brandId, typeId, img, info);
            console.log(info);
            console.log(response);
        }catch (e) {
            console.log(e);
        }
    }


    async allBrandType(marker) {
        try {
            const response = await OtherService.allBrandType(marker);
            if(marker === 'brand'){
                this.setBrand(response);
            }
            if (marker === 'type'){
                this.setType(response);
            }
            console.log(response);
            return response;
        }catch (e) {
            console.log(e);
        }
    }

}