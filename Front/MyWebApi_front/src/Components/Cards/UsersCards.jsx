import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { useNavigate } from "react-router-dom";

const UsersCards = ({AppUser}) => {
    const navigate = useNavigate();
    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const defaultImage = imagesUrl + "noimage.jpeg";
    const imageUrl = AppUser.image ? `${imagesUrl}${AppUser.image}` : defaultImage;

    const handleClick = () => {
        console.log(AppUser);
        navigate(`/profile/${AppUser.id}`);
    };

    return(
        <Card sx={{ maxWidth: 345, cursor: "pointer" }} onClick={handleClick}>
            <CardActionArea>
                <CardMedia
                    component="img"
                    height="150"
                    width="120"
                    image = {imageUrl}
                    title={`${AppUser.firstName} ${AppUser.lastName}`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImage;
                    }}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {AppUser.firstName || AppUser.lastName
                            ? `${AppUser.firstName || ""} ${AppUser.lastName || ""}`.trim()
                            : "Noname"}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {AppUser.email}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Метод входу: {AppUser.registrationMethod}
                    </Typography>
                    <Typography
                        variant="caption"
                        color="text.secondary"
                        mt={5}
                        gutterBottom
                        sx={{ fontSize: '0.6rem' }}>
                        ID: {AppUser.id}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
};

export default UsersCards;