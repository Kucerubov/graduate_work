import React from 'react';
import DeviceList from "../component/DeviceList";
import {observer} from "mobx-react-lite";


const Shop = () => {

    return (
        <DeviceList/>
    );
};

export default observer(Shop);