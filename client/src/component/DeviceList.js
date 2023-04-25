import React, { useContext, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Context } from "../index";
import DeviceItem from "./DeviceItem";
import {useLocation} from "react-router-dom";

export default function DeviceList() {
    const { deviceStore } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);
    const [itemsPerRow, setItemsPerRow] = useState(4); // количество элементов в строке
    const location = useLocation();
    const isHome = location.pathname === '/';

    useEffect(() => {
        if(isHome){
            const fetchData = async () => {
                await deviceStore.getDevices();
                setIsLoading(false);
            };
            fetchData();
        }
    }, [deviceStore]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 600) {
                setItemsPerRow(1);
            } else if (window.innerWidth < 960) {
                setItemsPerRow(2);
            } else {
                setItemsPerRow(3);
            }
        };

        handleResize();

        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isLoading) {
        return <div>Loading...</div>;
    }


    const groupedDevices = deviceStore.devices.rows.reduce(
        (resultArray, item, index) => {
            const chunkIndex = Math.floor(index / itemsPerRow);

            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [];
            }
            resultArray[chunkIndex].push(item);
            return resultArray;
        },
        []
    );

    return (
        <div sx={{ mt: 2, mb: 2 }}>
            {groupedDevices.map((group, index) => (
                <Stack
                    key={index}
                    direction="row"
                    divider={<Divider orientation="vertical" flexItem />}
                    spacing={2}
                    sx={{ mb: 2 }}
                >
                    {group.map((item) => (
                        <DeviceItem key={item.id} prop={item} />
                    ))}
                </Stack>
            ))}
        </div>
    );
}
