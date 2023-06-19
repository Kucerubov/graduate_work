import DeviceServices from "../services/DeviceServices";
import {makeAutoObservable} from "mobx";
import OtherService from "../services/OtherService";
import PCAssemblyService from "../services/PCAssemblyService";

export default class DeviceStore {

    constructor() {
        makeAutoObservable(this);
    }

    device;
    devices = null;
    brand = null;
    type = null;
    PCAssembly;
    selectType = null;
    selectBrand = null;

    setSelectBrand(selectBrand){
        this.selectBrand = selectBrand;
    }

    setSelectType(selectType){
        this.selectType = selectType;
    }

    setPCAssembly(PCAssembly) {
        this.PCAssembly = PCAssembly;
    }

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

    async getDeviceWithInfo(typeId){
        try {
            return await DeviceServices.DevicesInfo(typeId);
        }catch (e) {
            console.log(e);
        }
    }

    async getPCAssembly(id){
        try {
            const response = await PCAssemblyService.getPCAssembly(id);
            this.setPCAssembly(response);
            console.log(response);
        }catch (e) {
            console.log(e);
        }
    }


    async getDevices(brandId, typeId, limit, page){
         try {
             const response = await DeviceServices.Devices(brandId, typeId, limit, page);
             this.setDevices(response);
         } catch (e){
             console.log(e);
         }
    }

    async getDeviceID(id) {
        try {
            const response = await DeviceServices.DeviceID(id);
            this.setDevice(response);
        } catch (e) {
            console.log(e);
        }
    }

    async addDevice(name, price, videoId, brandId, typeId, img, info){
        try {
            const response = await DeviceServices.addDevice(name, price, videoId, brandId, typeId, img, info);
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
            return response;
        }catch (e) {
            console.log(e);
        }
    }

}