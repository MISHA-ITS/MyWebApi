import './App.css'
import { Routes, Route } from "react-router-dom";
import DefaultLayout from "./Components/Layouts/DefaultLayout.jsx";
import UsersPage from "./pages/UsersPage.jsx";
import MainPage from "./pages/MainPage.jsx";
import NotFoundPage from "./pages/NotFoundPage.jsx";
import SignInPage from "./pages/SignInPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import ProFilePage from "./pages/ProFilePage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<DefaultLayout/>}>
                <Route index element={<MainPage />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/sign-in" element={<SignInPage />} />
                <Route path="/sign-up" element={<SignUpPage />} />
                <Route path="/pro-file" element={<ProFilePage />} />
                <Route path="/profile/:userId" element={<ProFilePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    );
}

export default App;
