import React, { useContext, useEffect, useState } from 'react';
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { useParams } from 'react-router-dom';
import { Context } from "../index";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled } from '@mui/system';
import Modal from "@mui/material/Modal";

const DeviceImage = styled('img')({
    width: '100%',
    maxWidth: '300px',
});

const DevicePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [device, setDevice] = useState();
    const [openModal, setOpenModal] = useState(false);
    const { id } = useParams();
    const { store, deviceStore } = useContext(Context);

    useEffect(() => {
        async function fetchData() {
            await deviceStore.getDeviceID(id);
            setDevice(deviceStore.device);
            setIsLoading(false);
            console.log(device);
        }

        fetchData();
    }, [id]);

    const handleOpenModal = () => {
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
    };

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
                bgcolor="#ffffff"
                p={2}
                borderRadius={8}
                boxShadow={3}
            >
                <Box
                    display="flex"
                    justifyContent="flex-start"
                    p={2}
                >
                <Box ml={2} mr={4} mt={2}>
                    <Box mb={2} >
                        <DeviceImage src={`http://localhost:5000/${device?.img}`} alt="Device Image"/>
                    </Box>
                    <Box mb={2}>
                        <Button variant="contained" color="primary" onClick={handleOpenModal}>
                            Watch Video
                        </Button>
                        <Modal
                            open={openModal}
                            onClose={handleCloseModal}
                            aria-labelledby="video-modal-title"
                            aria-describedby="video-modal-description"
                        >
                            <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
                                <iframe
                                    width="560"
                                    height="315"
                                    src={`https://www.youtube.com/embed/${device?.videoID}`}
                                    title="YouTube video player"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                    allowFullScreen
                                />
                            </Box>
                        </Modal>
                    </Box>
                </Box>
                <Divider orientation="vertical" flexItem />
                <Box ml={4} mt={2}>
                    <Box mb={2}>
                        <Typography variant="h6">Price: ${device?.price}</Typography>
                    </Box>
                    <Button
                        onClick={() => {store.addDeviceInBasket(id)}}
                        variant="contained"
                        color="primary"
                    >
                        Add to Cart
                    </Button>
                </Box>
                </Box>
                <Box>
                    <Divider orientation="horizontal"/>
                    <Box mb={2}>
                        <Typography variant="h6">Specifications:</Typography>
                        {
                            device.info.map(({id, title, description}) => (
                                <Box display={"flex"} alignItems={"center"} key={id}>
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {`${title} - `}
                                    </Typography>
                                    <Typography variant="body1">{description}</Typography>
                                </Box>
                            ))
                        }
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default DevicePage;
