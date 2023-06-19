import React, {useContext, useEffect, useState} from 'react';
import { observer } from 'mobx-react-lite';
import {Box, Button, CircularProgress, IconButton, Typography} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Context } from '../index';

const Basket = observer(() => {
    const { store } = useContext(Context);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function basket() {
            await store.openBasket();
            setIsLoading(false);
        }
        basket();
    }, [store]);

    if(isLoading){
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </div>
        );
    }

    return (
        <Box
        >
            {store.deviceInBasket.map((device) => (
                <Box
                    key={device.id}
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        width: 'calc(100% - 1rem)',
                        height: '150px',
                        padding: '0.5rem',
                        marginTop: '1rem',
                        backgroundColor: 'white',
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
                        borderRadius: '10px',
                    }}
                >
                    <img
                        src={`http://localhost:5000/${device.img}`}
                        alt={device.name}
                        style={{ width: '250px', height: '150px', objectFit: 'cover', borderRadius: '10px' }}
                    />
                    <Typography variant="h5" sx={{marginLeft: '4rem'}}>{device.name}</Typography>
                    <Box sx={{display: 'flex', marginRight: 0, justifyContent: 'space-between'}}>
                        <Typography variant="h6" sx={{marginRight: '6rem'}}>{device.price}₴</Typography>
                        <Button
                            sx={{right: '3rem',}}
                            variant="contained"
                            color="primary"
                            onClick={store.makeOrder}
                        >
                            Make an Order
                        </Button>
                        <IconButton
                            sx={{
                                right: '3rem',
                            }}
                            onClick={store.closeBasket}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Box>
                </Box>
            ))}
        </Box>
    );
});

export default Basket;
