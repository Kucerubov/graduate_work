import DeviceServices from "../services/DeviceServices";
import {makeAutoObservable} from "mobx";

export default class DeviceStore {

    constructor() {
        makeAutoObservable(this);
    }

    device;
    devices;

    setDevice(device) {
        this.device = device;
    }

    setDevices(devices){
        this.devices = devices;
    }


    async getDevices(){
         try {
             const response = await DeviceServices.Devices();
             this.setDevices(response);
         } catch (e){
             console.log(e);
         }
     }

     async getDeviceID(id) {
         try {
             const response = await DeviceServices.getDeviceID(id);
             console.log(response);
             this.setDevice(response);
         } catch (e) {
             console.log(e);
         }
     }
}