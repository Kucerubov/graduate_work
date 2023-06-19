import React, {useContext, useState} from 'react';
import Button from "@mui/material/Button";
import {Modal} from "@mui/material";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import {Context} from "../../index";
import {observer} from "mobx-react-lite";

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
};

const CreateBrand = ({show, onHide}) => {
    const { store } = useContext(Context);
    const [brand, setBrand] = useState();

    const handleSubmit = async () => {
        try {
            const data = await store.addTypeBrand('brand', brand);
            if(data){
                onHide();
            }
        }catch (e){
            console.log(e);
        }
    };

    return (
        <div>
            <Modal
                keepMounted
                open={show}
                onClose={onHide}
                aria-labelledby="keep-mounted-modal-title"
                aria-describedby="keep-mounted-modal-description"
            >
                <Box  sx={style}>
                    <Typography variant="h6" component="h2">
                        Add Brand
                    </Typography>
                    <TextField
                        onChange={(event) => setBrand(event.target.value)}
                        value={brand}
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Brand"
                        autoComplete="text"
                        autoFocus
                    />
                    <Button onClick={onHide} variant="outlined" color="primary" sx={{ mr: 2}}>Close</Button>
                    <Button onClick={() => handleSubmit()} variant="outlined" color="primary">Add</Button>
                </Box>
            </Modal>
        </div>
    );
};

export default observer(CreateBrand);