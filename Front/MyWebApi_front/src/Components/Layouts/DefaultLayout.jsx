import Navbar from "../Navbar/Navbar";
import { Outlet } from "react-router-dom";
import Box from "@mui/material/Box";

const DefaultLayout = () => {
    return (
        <>
            <Navbar/>
            <Box>
                <Outlet/>
            </Box>
        </>
    )
}

export default DefaultLayout;