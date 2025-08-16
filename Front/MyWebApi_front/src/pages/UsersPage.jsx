import {useEffect, useState} from "react";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import UsersCards from "../components/Cards/UsersCards";

function UsersPage() {
    const [users, setUsers] = useState([]);
    const url = import.meta.env.VITE_API_URL +"user/List";

    const fetchData = async () => {
        const response = await axios.get(url);
        console.log(response.data);
        if (response.status === 200) {
            setUsers(response.data.payLoad);
            console.log(response.data);
        }
        console.log(response);
    }

    useEffect(() => {
        console.log("UsersPage mounted");
        fetchData().catch(error => console.error(error))
    }, []);

    return (
        <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <Grid container spacing={2} sx={{ backgroundColor: 'lightgray', padding: 2 }}>
                {users.map((user) => (
                    <Grid key={user.id} item xs={12} sm={6} md={4} lg={3}>
                        <UsersCards AppUser={user} />
                    </Grid>
                ))}
            </Grid>
        </Box>
    )
}

export default UsersPage