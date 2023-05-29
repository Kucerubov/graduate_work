import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import {Rating} from "@mui/material";
import {useNavigate} from "react-router-dom";
import {DEVICE_ROUTE} from "../utils/consts";

export default function DeviceItem(prop) {
    const navigate = useNavigate();
    const {id, name, price, rating, img} = prop.prop;

    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                onClick={() => {navigate(`${DEVICE_ROUTE}/${id}`)}}
                sx={{ height: 190 }}
                component="img"
                image={`http://localhost:5000/${img}`}
                title="green iguana"
                onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/150";
                }}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div" onClick={() => {navigate(`${DEVICE_ROUTE}/${id}`)}}>
                    {name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Lizards are a widespread group of squamate reptiles, with over 6,000
                    species, ranging across all continents except Antarctica
                </Typography>
                <Rating name="read-only" value={rating} readOnly mt={2}/>
            </CardContent>
            <CardActions sx={{ display: 'flex', justifyContent: 'space-between', alignContent: 'center'}}>
                <Typography gutterBottom variant="h5" component="div" sx={{ alignSelf: 'center', marginBottom: '0'}}>
                    {price}₴
                </Typography>
                <Button variant="outlined" size="small" sx={{ alignSelf: 'flex-end' }}>Buy</Button>
            </CardActions>
        </Card>
    );
}