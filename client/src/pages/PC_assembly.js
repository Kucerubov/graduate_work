import React, {useContext, useEffect, useState} from 'react';
import {Context} from '../index';
import {Autocomplete, Card, CardContent, Grid, Typography} from '@mui/material';
import TextField from '@mui/material/TextField';
import {observer} from 'mobx-react-lite';

const PcAssembly = () => {
    const [isLoading, setIsLoading] = useState(true);
    const { deviceStore } = useContext(Context);
    const [ListProperty, setListProperty] = useState();
    const [selectedDevices, setSelectedDevices] = useState({});
    const [arrayProperty, setArrayProperty] = useState({});

    useEffect(() => {
        async function fetchData() {
            await setListProperty(deviceStore.type);
            const devicesByType = {};
            for (const type of deviceStore.type) {
                devicesByType[type.name] = await deviceStore.getDeviceWithInfo(type.id);
                setSelectedDevices((prevState) => ({
                    ...prevState,
                    [type.name]: null,
                }));
            }
            setArrayProperty(devicesByType);
            setIsLoading(false);
        }
        fetchData();
    }, [deviceStore, ListProperty]);

    const handleComponentChange = (componentId, selectedOption) => {
        setSelectedDevices((prevState) => ({
            ...prevState,
            [componentId]: selectedOption,
        }));
        console.log(selectedDevices);
        // Обновить данные в другом автозаполнении
        if (componentId === 'Processor') {
            console.log(selectedOption);
            const motherboardData = getUpdatedMotherboardData(selectedOption);
            setArrayProperty((prevState) => ({
                ...prevState,
                MotherBoard: motherboardData,
            }));
        }
    };

    const getUpdatedMotherboardData = (selectedProcessor) => {
        const selectedSocket = selectedProcessor.info
            .filter(({ title }) => /socket/i.test(title))
            .map(({ description }) => description);
        console.log(selectedSocket);
        const selectedDevices = [];

        Object.entries(arrayProperty).forEach(([name, devices]) => {
            if (name === "MotherBoard") {
                devices.forEach((device) => {
                    if (device.info && device.info.some((info) => info.description === selectedSocket[0])) {
                        selectedDevices.push(device);
                    }
                });
            }
        });

        console.log(selectedDevices)
        return selectedDevices;
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Typography variant="h5" component="h2" gutterBottom>
                PC Assembly
            </Typography>
            {ListProperty.map((component) => (
                <Card key={component.id} sx={{ marginBottom: '1rem' }}>
                    <CardContent>
                        <Grid container spacing={2} alignItems="center">
                            <Grid item xs={4}>
                                <Typography variant="body1" component="div">
                                    {component.name}
                                </Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Autocomplete
                                    value={selectedDevices[component.name] || null}
                                    options={arrayProperty[component.name] || []}
                                    getOptionLabel={(option) => option.name}
                                    loading={!arrayProperty[component.name]}
                                    onChange={(event, newValue) =>
                                        handleComponentChange(component.name, newValue)
                                    }
                                    renderInput={(params) => (
                                        <TextField {...params} label="Choose a component" />
                                    )}
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default observer(PcAssembly);
