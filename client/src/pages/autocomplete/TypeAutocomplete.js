import React, {useContext, useEffect} from 'react';
import {Autocomplete, CircularProgress} from "@mui/material";
import TextField from "@mui/material/TextField";
import {Context} from "../../index";

const BrandAutocomplete = () => {
    const [open, setOpen] = React.useState(false);
    const [options, setOptions] = React.useState([]);
    const loading = open && options.length === 0;
    const {deviceStore} = useContext(Context);

    useEffect(() => {
        let active = true;

        if (!loading) {
            return undefined;
        }

        (async () => {
            const data = await deviceStore.type;
            if (active && data) {
                setOptions([...data]);
            }
        })();

        return () => {
            active = false;
        };
    }, [loading, deviceStore.type, deviceStore.device]);

    const handleTypeSelect = (type) => {
        deviceStore.setSelectType(type);
    };

    useEffect(() => {
        if (!open) {
            setOptions([]);
        }
    }, [open]);

    return (
        <Autocomplete
            id="asynchronous-demo"
            sx={{ width: 300 }}
            open={open}
            onOpen={() => {
                setOpen(true);
            }}
            onClose={() => {
                setOpen(false);
            }}
            isOptionEqualToValue={(option, value) => option.name === value.name}
            getOptionLabel={(option) => option.name}
            options={options}
            loading={loading}
            onChange={(event, value) => handleTypeSelect(value)}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Type"
                    InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                            <React.Fragment>
                                {loading ? <CircularProgress color="inherit" size={20} /> : null}
                                {params.InputProps.endAdornment}
                            </React.Fragment>
                        ),
                    }}
                />
            )}
        />
    );
};

export default BrandAutocomplete;