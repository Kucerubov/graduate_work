import React, {useContext} from 'react';
import {Routes, Route} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes";
import Shop from "../pages/Shop";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const AppRouter = () => {

    const {store} = useContext(Context);

    return (
        <Routes>
            {store.isAuth && authRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} match="exact" />
            ))}
            {publicRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} match="exact" />
            ))}
            <Route path='*' element={<Shop/>} />
        </Routes>
    );
};

export default observer(AppRouter);