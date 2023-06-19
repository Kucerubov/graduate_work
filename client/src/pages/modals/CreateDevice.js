import React, { useContext, useState } from 'react';
import { Context } from '../../index';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import {Autocomplete, Input, Modal} from '@mui/material';
import { observer } from 'mobx-react-lite';
import Grid from '@mui/material/Grid';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 700,
    bgcolor: 'background.paper',
    border: '2px solid #fff',
    boxShadow: 24,
    p: 4,
};

const CreateDevice = ({ show, onHide }) => {
    const { deviceStore } = useContext(Context);
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [brand, setBrand] = useState('');
    const [type, setType] = useState('');
    const [img, setImg] = useState();
    const [videoId, setVideoId] = useState('');
    const [info, setInfo] = useState([]);

    const addInfo = () => {
        setInfo([...info, { title: '', description: '', number: Date.now() }]);
    };
    const removeInfo = (number) => {
        setInfo(info.filter((i) => i.number !== number));
    };

    const changeInfo = (key, value, number) => {
        setInfo(info.map(i => i.number === number ? {...i, [key]: value} : i))
    }
    const typeProps = {
        options: deviceStore.type,
        getOptionLabel: (option) => option.name,
        onChange: (event, value) => setType(value.id),
    };

    const brandProps = {
        options: deviceStore.brand,
        getOptionLabel: (option) => option.name,
        onChange: (event, value) => setBrand(value.id),
    };

    const handleImageUpload = (event) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            const file = files[0];
            setImg(file);
        }
    };

    const handleSubmit = async () => {
        try {
            console.log(videoId);
            const data = await deviceStore.addDevice(name, price, videoId, brand, type, img, info);
            if (data) {
                onHide();
            }
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Modal
            keepMounted
            open={show}
            onClose={onHide}
            aria-labelledby="keep-mounted-modal-title"
            aria-describedby="keep-mounted-modal-description"
        >
            <Box sx={style}>
                <Box sx={{ maxHeight: '80vh', overflowY: 'auto' }}>
                <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                    Add Device
                </Typography>
                <TextField
                    onChange={(event) => setName(event.target.value)}
                    value={name}
                    margin="normal"
                    required
                    fullWidth
                    id="name"
                    label="Name Device"
                    autoComplete="text"
                    autoFocus
                />
                <TextField
                    onChange={(event) => setPrice(event.target.value)}
                    value={price}
                    margin="normal"
                    required
                    fullWidth
                    id="price"
                    label="Price device"
                    autoComplete="text"
                    autoFocus
                />
                <TextField
                    onChange={(event) => setVideoId(event.target.value)}
                    value={videoId}
                    margin="normal"
                    required
                    fullWidth
                    id="videoId"
                    label="video ID"
                    autoComplete="text"
                    autoFocus
                />
                <label htmlFor="uploadbtn" className="uploadButton">
                    <Button variant="contained" component="span">
                        Upload file
                    </Button>
                    <div></div>
                    <input
                        style={{ opacity: 0, zIndex: -1 }}
                        multiple
                        type="file"
                        name="upload"
                        id="uploadbtn"
                        onChange={(event) => {
                            document.querySelector('.uploadButton div').innerHTML = Array.from(event.target.files)
                                .map((f) => f.name)
                                .join('<br />');
                            handleImageUpload(event);
                        }}
                    />
                </label>
                <Stack spacing={1} sx={{ width: 300, mb: 2 }}>
                    <Autocomplete
                        {...typeProps}
                        id="select-type"
                        disableCloseOnSelect
                        renderInput={(params) => <TextField {...params} label="Select Type" variant="standard" />}
                    />
                    <Autocomplete
                        {...brandProps}
                        id="select-brand"
                        disableCloseOnSelect
                        renderInput={(params) => <TextField {...params} label="Select Brand" variant="standard" />}
                    />
                </Stack>
                <Button variant="outlined" color="primary" sx={{ mr: 2, mb: 2 }} onClick={addInfo}>
                    Add new info
                </Button>
                {info.map((i) => (
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center'}} key={i.number} mb={2}>
                        <Grid container spacing={3}>
                            <Grid item xs={4}>
                                <TextField
                                    value={i.title}
                                    onChange={(e) => changeInfo('title', e.target.value, i.number)}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="name_info"
                                    label="property name"
                                    autoComplete="text"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <TextField
                                    value={i.description}
                                    onChange={(e) => changeInfo('description', e.target.value, i.number)}
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="information_description"
                                    label="Information description"
                                    autoComplete="text"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={2}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => removeInfo(i.number)}
                                    sx={{ mr: 2 }}
                                >
                                    Delete
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>
                ))}
                <Box display="flex" justifyContent="flex-end">
                    <Button onClick={onHide} variant="outlined" color="primary" sx={{ mr: 2 }}>
                        Close
                    </Button>
                    <Button onClick={handleSubmit} variant="outlined" color="primary">
                        Add
                    </Button>
                </Box>
                </Box>
            </Box>
        </Modal>
    );
};

export default observer(CreateDevice);
