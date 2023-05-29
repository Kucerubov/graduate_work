import React, {useContext, useEffect, useState} from 'react';
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import CreateBrand from "./modals/CreateBrand";
import CreateType from "./modals/CreateType";
import CreateDevice from "./modals/CreateDevice";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const Admin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [brandVisible, setBrandVisible] = useState(false);
    const [typeVisible, setTypeVisible] = useState(false);
    const [deviceVisible, setDeviceVisible] = useState(false);

    const {deviceStore} = useContext(Context);

    useEffect(()=>{
        async function Data(){
            if(deviceStore.type === null || deviceStore.brand === null){
                await deviceStore.allBrandType('type');
                await deviceStore.allBrandType('brand');
            }
            setIsLoading(false);
        }
        Data();
    })

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            marginTop={4}
        >
            <Button
                onClick={() => setBrandVisible(true)}
                variant="outlined"
                color="primary"
                sx={{ mb: 2, width: '200px' }}>
                Add brand
            </Button>
            <Button
                onClick={() => setTypeVisible(true)}
                variant="outlined"
                color="primary"
                sx={{ mb: 2, width: '200px' }}>
                Add type
            </Button>
            <Button
                onClick={() => setDeviceVisible(true)}
                variant="outlined"
                color="primary"
                sx={{ width: '200px' }}>
                Add device
            </Button>
            <CreateBrand show={brandVisible} onHide={() => setBrandVisible(false)}/>
            <CreateType show={typeVisible} onHide={() => setTypeVisible(false)}/>
            <CreateDevice show={deviceVisible} onHide={() => setDeviceVisible(false)}/>
        </Box>
    );
};

export default observer(Admin);