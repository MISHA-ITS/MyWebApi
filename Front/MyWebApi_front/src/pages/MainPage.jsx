import React from "react";
import { Container, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function MainPage() {
    const { isAuth } = useSelector(state => state.account);
    const navigate = useNavigate();

    return (
        <>
            <div className="App" style={{textAlign: "center", margin: "50px", backgroundColor: "cadetblue", color: "white", padding: "70px"}}>
                <h1>Введення у Web 3.0. Використання ASP.NET Core на Azure</h1>
                <h3>Хмарні технології і використання Microsoft Azure під час розробки додатків (10.0.0)</h3>
                {isAuth ? (
                    <Box>
                        <Link to="/users" style={{ textDecoration: "none" }}>
                            <Button variant="contained" color="primary">
                                Переглянути список користувачів
                            </Button>
                        </Link>
                    </Box>
                ) : (
                    <Box>
                        <h5>
                            Увійдіть, щоб ереглянути список користувачів.
                        </h5>
                    </Box>
                )}
            </div>
        </>
    );
}

export default MainPage;