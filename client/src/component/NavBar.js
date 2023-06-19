import React, {useContext, useEffect, useState} from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import AdbIcon from '@mui/icons-material/Adb';
import {Link, useNavigate} from "react-router-dom";
import {
    ADMIN_ROUTE,
    BASKET_ROUTE,
    LOGIN_ROUTE,
    PC_ASSEMBLY_ROUTER,
    REGISTRATION_ROUTE,
    SHOP_ROUTE
} from "../utils/consts";
import {Context} from "../index";
import {observer} from "mobx-react-lite";

const NavBar = () => {

    const { store } = useContext(Context);
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = useState(null);
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [pages, setPages] = useState([{ title: 'Shop', link: SHOP_ROUTE }]);

    const settings = [
        { title: 'Profile', action: () => alert('Go to profile') },
        { title: 'Logout', action: () => store.logout() },
    ];

    if (store.user.role === 'ADMIN') {
        settings.push({
            title: 'Admin',
            action: () => navigate(ADMIN_ROUTE),
        });
    }

    useEffect(() => {
        async function check() {
            try {
                if (localStorage.getItem('token')) {
                    await store.checkAuth();
                }
                if (store.isAuth) {
                    setPages([{ title: 'Shop', link: SHOP_ROUTE }, { title: 'Basket', link: BASKET_ROUTE }, { title: 'PC Assembly', link: PC_ASSEMBLY_ROUTER + `/${store.user.id}` }]);
                } else {
                    setPages([{ title: 'Shop', link: SHOP_ROUTE }]);
                }
                setIsLoading(false);
            } catch (error) {
                console.log(error);
                setIsLoading(false);
            }
        }
        check();
    }, [store.isAuth, setPages, store]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const handleOpenNavMenu = (event) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = () => {
        setAnchorElNav(null);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    return (
        <AppBar position="static">
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <AdbIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
                    <Typography
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        CompShop
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {pages.map(({title, link}) => (
                                <MenuItem key={title} onClick={handleCloseNavMenu}>
                                    <Typography textAlign="center">
                                        <Link to={link}  style={{ textDecoration: 'none' }}>{title}</Link>
                                    </Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <AdbIcon sx={{ display: { xs: 'flex', md: 'none' }, mr: 1 }} />
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'inherit',
                            textDecoration: 'none',
                        }}
                    >
                        LOGO
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map(({title, link}) =>
                            (<Link key={title} to={link}  style={{ textDecoration: 'none' }}>
                                    <Button
                                        sx={{ my: 2, color: 'white', display: 'block' }}
                                    >
                                        {title}
                                    </Button>
                                </Link>
                            ))}
                    </Box>
                    {store.isAuth ?
                        <Box sx={{ flexGrow: 0 }}>
                            <Tooltip title="Open settings">
                                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                    <Avatar alt="" src="/static/images/avatar/2.jpg" />
                                </IconButton>
                            </Tooltip>
                            <Menu
                                sx={{ mt: '45px' }}
                                id="menu-appbar"
                                anchorEl={anchorElUser}
                                anchorOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                keepMounted
                                transformOrigin={{
                                    vertical: 'top',
                                    horizontal: 'right',
                                }}
                                open={Boolean(anchorElUser)}
                                onClose={handleCloseUserMenu}
                            >
                                {settings.map(({ title, action }) => (
                                    <MenuItem key={title} onClick={() => {
                                        handleCloseUserMenu();
                                        action();
                                    }}>
                                        <Typography textAlign="center">{title}</Typography>
                                    </MenuItem>
                                ))}
                            </Menu>
                        </Box>
                        :
                        <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' }, justifyContent: 'flex-end'}}>
                            <Link to={LOGIN_ROUTE} style={{ textDecoration: 'none' }}>
                                <Button  sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Login
                                </Button>
                            </Link>
                            <Link to={REGISTRATION_ROUTE} style={{ textDecoration: 'none' }}>
                                <Button  sx={{ my: 2, color: 'white', display: 'block' }}>
                                    Registration
                                </Button>
                            </Link>
                        </Box>
                    }

                </Toolbar>
            </Container>
        </AppBar>
    );
};

export default observer(NavBar);
