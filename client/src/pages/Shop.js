import React, {useContext, useEffect, useState} from 'react';
import DeviceList from "../component/DeviceList";
import {observer} from "mobx-react-lite";
import BrandAutocomplete from "./autocomplete/BrandAutocomplete";
import TypeAutocomplete from "./autocomplete/TypeAutocomplete";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import {Context} from "../index";
import {useLocation} from "react-router-dom";

const Shop = () => {

    const {deviceStore} = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        if(isHome){
            const fetchData = async () => {
                await deviceStore.allBrandType('type');
                await deviceStore.allBrandType('brand');
                await deviceStore.getDevices();
                setIsLoading(false);
            };
            fetchData();
        }
    });

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Box display="flex" justifyContent="flex-start">
                <Box ml={2} mr={4} mt={2}>
                    <Box mb={2}>
                        <BrandAutocomplete />
                    </Box>
                    <Box>
                        <TypeAutocomplete />
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box ml={4} mt={2}>
                    <DeviceList />
                </Box>
            </Box>
        </>
    );
};

export default observer(Shop);