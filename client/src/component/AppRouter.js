import React from 'react';
import {Routes, Route} from 'react-router-dom';
import {authRoutes, publicRoutes} from "../routes";
import Shop from "../pages/Shop";

const AppRouter = () => {
    const isAuth = false;
    return (
        <Routes>
            {isAuth && authRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} match="exact" />
            ))}
            {publicRoutes.map(({path, Component}) => (
                <Route key={path} path={path} element={<Component />} match="exact" />
            ))}
            <Route path='*' element={<Shop/>} />
        </Routes>
    );
};

export default AppRouter;