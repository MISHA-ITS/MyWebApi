import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
const UsersCards = ({AppUser}) => {
    console.log(AppUser);

    const imagesUrl = import.meta.env.VITE_IMAGES_URL;
    const defaultImage = imagesUrl + "noimage.jpeg";
    const imageUrl = AppUser.image ? `${imagesUrl}${AppUser.image}` : defaultImage;

    return(
        <Card sx={{ maxWidth: 345 }}>
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
                        {AppUser.firstName} {AppUser.lastName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        {AppUser.email}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    )
};

export default UsersCards;