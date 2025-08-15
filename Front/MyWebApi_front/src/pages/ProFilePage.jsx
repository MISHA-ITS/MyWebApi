import React, { useEffect, useMemo } from "react";
import { Button, Container, Grid, Paper, Typography, Box } from "@mui/material";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAction } from "../hooks/useAction";
import UserLogins from "../Components/UserLogins/UserLogins";

function ProFilePage() {
    const { googleLogin } = useAction();
    const { user } = useSelector(state => state.account);
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;

    const defaultImage = `${imagesUrl}noimage.jpeg`;

    useEffect(() => {
        if (!user) {
            const token = localStorage.getItem("oauth");
            if (token) {
                googleLogin(token);
            }
        }
    }, [googleLogin, user]);

    const avatarUrl = useMemo(() => {
        if (user?.image) {
            return `${imagesUrl}${user.image}`;
        }
        return defaultImage;
    }, [user?.image, imagesUrl]);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom align="center">
                ПРОФІЛЬ КОРИСТУВАЧА
            </Typography>

            <Grid container spacing={3}>
                {/* Профіль користувача */}
                <Grid item xs={12} md={6}>
                    <Paper elevation={3} sx={{ p: 3, textAlign: "center" }}>
                        <Box
                            component="img"
                            src={avatarUrl}
                            alt="User Profile"
                            sx={{
                                width: 120,
                                height: 120,
                                borderRadius: "50%",
                                mb: 2,
                                border: "3px solid #e0e0e0"
                            }}
                            onError={(e) => {
                                e.currentTarget.src = defaultImage;
                            }}
                        />
                        <Typography variant="h6" gutterBottom>
                            {user.Firstname || user.firstName} {user.Lastname || user.lastName}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                            {user.email}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                            ID: {user.nameid || user.sub}
                        </Typography>

                        <Box mt={2}>
                            <Link to="/" style={{ textDecoration: "none" }}>
                                <Button variant="contained" color="primary">
                                    На головну
                                </Button>
                            </Link>
                        </Box>
                    </Paper>
                </Grid>

                {/* Зовнішні акаунти */}
                <Grid item xs={12} md={6}>
                    <UserLogins userId={user.nameid || user.sub} />
                </Grid>
            </Grid>
        </Container>
    );
}

export default ProFilePage;
