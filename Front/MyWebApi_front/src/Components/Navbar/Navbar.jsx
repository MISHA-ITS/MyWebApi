import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import {Link} from "react-router-dom";
import {useSelector} from "react-redux";
import {useAction} from "../../Hooks/useAction.js";

const getInitials = (firstName, lastName) => {
    const f = firstName?.[0] ?? "";
    const l = lastName?.[0] ?? "";
    return (f + l).toUpperCase() || "?";
};

const Navbar = () => {
    const {isAuth, user} = useSelector(state => state.account);
    const {logout} = useAction();

    const imagesUrl = import.meta.env.VITE_IMAGES_URL;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar>
                    <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                        {isAuth && user ? (
                            <Link to="/pro-file" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Avatar
                                    src={user.image ? `${imagesUrl}${user.image}` : undefined}
                                    alt={`${user.firstname || user.name} ${user.lastname || ""}`}
                                >
                                    {getInitials(user.firstname || user.name, user.lastname)}
                                </Avatar>
                                <Typography variant="subtitle1" component="div">
                                    {user.firstname || user.name || "User"}
                                </Typography>
                            </Link>
                        ) : (
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>

                            </Typography>
                        )}
                    </Box>
                    <Box>
                        {isAuth ?
                            <>
                                <Link to="/pro-file">
                                    <Button color="inherit">{user.email}</Button>
                                </Link>
                                <Button onClick={() => logout()} color="inherit">Logout</Button>
                            </>
                                : <Link to="sign-in">
                                    <Button color="inherit">Login</Button>
                                </Link>
                        }
                    </Box>
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export default Navbar;