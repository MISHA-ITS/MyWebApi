import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
    Card, 
    CardContent, 
    Typography, 
    List, 
    ListItem, 
    ListItemText,
    IconButton,
    Chip,
    Box,
    Alert,
    CircularProgress
} from '@mui/material';
import { Delete as DeleteIcon, Google as GoogleIcon } from '@mui/icons-material';
import { getUserLogins, removeLogin } from '../../Store/Reducers/accountReducer/actions';

const UserLogins = ({ userId }) => {
    const dispatch = useDispatch();
    const { userLogins, loginsLoading, loginsError, removeLoginError } = useSelector(state => state.account);

    useEffect(() => {
        if (userId) {
            dispatch(getUserLogins(userId));
        }
    }, [dispatch, userId]);

    const handleRemoveLogin = (loginProvider, providerKey) => {
        if (window.confirm('Ви впевнені, що хочете видалити цей зовнішній акаунт?')) {
            dispatch(removeLogin(userId, loginProvider, providerKey));
        }
    };

    const getProviderIcon = (provider) => {
        switch (provider.toLowerCase()) {
            case 'google':
                return <GoogleIcon />;
            default:
                return null;
        }
    };

    const getProviderColor = (provider) => {
        switch (provider.toLowerCase()) {
            case 'google':
                return 'error';
            default:
                return 'default';
        }
    };

    if (loginsLoading) {
        return (
            <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Card>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    Зовнішні акаунти
                </Typography>

                {loginsError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {loginsError}
                    </Alert>
                )}

                {removeLoginError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {removeLoginError}
                    </Alert>
                )}

                {userLogins.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        У вас немає підключених зовнішніх акаунтів
                    </Typography>
                ) : (
                    <List>
                        {userLogins.map((login, index) => (
                            <ListItem key={index} divider>
                                <ListItemText
                                    primary={
                                        <Box display="flex" alignItems="center" gap={1}>
                                            {getProviderIcon(login.loginProvider)}
                                            <Typography variant="subtitle1">
                                                {login.providerDisplayName || login.loginProvider}
                                            </Typography>
                                            <Chip 
                                                label={login.loginProvider} 
                                                size="small" 
                                                color={getProviderColor(login.loginProvider)}
                                                variant="outlined"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="body2" color="text.secondary">
                                            ID: {login.providerKey}
                                        </Typography>
                                    }
                                />
                                <ListItemSecondaryAction>
                                    <IconButton
                                        edge="end"
                                        aria-label="delete"
                                        onClick={() => handleRemoveLogin(login.loginProvider, login.providerKey)}
                                        color="error"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default UserLogins;


