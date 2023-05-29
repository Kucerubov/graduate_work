import React, { useContext, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useParams } from 'react-router-dom';
import { Context } from "../index";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/system';

const DeviceImage = styled('img')({
    width: '100%',
    maxWidth: '300px',
});

const DevicePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState();
    const { id } = useParams();
    const { deviceStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            await deviceStore.getDeviceID(id);
            setDevice(deviceStore.device);
            setIsLoading(false);
        }

        fetchData();
    }, [id]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="flex-start"
            height="100vh"
            backgroundColor="#f5f5f5"
            pt={4}
        >
            <Box
                display="flex"
                justifyContent="flex-start"
                bgcolor="#ffffff"
                p={2}
                borderRadius={8}
                boxShadow={3}
            >
                <Box ml={2} mr={4} mt={2}>
                    <Box mb={2}>
                        <DeviceImage src={`http://localhost:5000/${device?.img}`} alt="Device Image" />
                    </Box>
                    <Box mb={2}>
                        <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${device?.videoID}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen/>
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box mb={2}>
                    <Typography variant="h6">Specifications:</Typography>
                    <Typography>{device?.specs}</Typography>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box ml={4} mt={2}>
                    <Box mb={2}>
                        <Typography variant="h6">Price: ${device?.price}</Typography>
                    </Box>
                    <Button variant="contained" color="primary">
                        Add to Cart
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default DevicePage;
