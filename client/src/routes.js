import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    DEVICE_ROUTE,
    LOGIN_ROUTE,
    PC_ASSEMBLY_ROUTER,
    REGISTRATION_ROUTE,
    SHOP_ROUTE
} from "./utils/consts";
import Admin from "./pages/Admin";
import Basket from "./pages/Basket";
import Shop from "./pages/Shop";
import SingIn from "./pages/SingIn";
import Registration from "./pages/Registration";
import DevicePage from "./pages/DevicePage";
import PC_assembly from "./pages/PC_assembly";


export const authRoutes = [
    {
        path: ADMIN_ROUTE,
        Component: Admin
    },
    {
        path: BASKET_ROUTE,
        Component: Basket
    },
    {
        path: PC_ASSEMBLY_ROUTER + '/:id',
        Component: PC_assembly
    }
]

export const publicRoutes = [
    {
        path: SHOP_ROUTE,
        Component: Shop
    },
    {
        path: LOGIN_ROUTE,
        Component: SingIn
    },
    {
        path: REGISTRATION_ROUTE,
        Component: Registration
    },
    {
        path: DEVICE_ROUTE + '/:id',
        Component: DevicePage
    },

]
