import React, { useContext, useEffect, useState } from "react";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { Context } from "../index";
import DeviceItem from "./DeviceItem";
import {observer} from "mobx-react-lite";

function DeviceList() {
    const { deviceStore } = useContext(Context);
    const [itemsPerRow, setItemsPerRow] = useState(3); // количество элементов в строке


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


    const groupedDevices = deviceStore.devices?.rows.reduce(
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
            {groupedDevices?.map((group, index) => (
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

export default observer(DeviceList);
