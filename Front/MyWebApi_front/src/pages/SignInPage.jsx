import * as React from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import {
    Avatar,
    Box,
    Button,
    Checkbox,
    CssBaseline,
    FormControlLabel,
    Divider,
    FormLabel,
    FormControl,
    Link,
    TextField,
    Typography,
    Stack,
    Card as MuiCard,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { styled } from "@mui/material/styles";
import { useAction } from "../Hooks/useAction.js"; // має повертати { login, googleLogin }
import * as yup from "yup";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";

const Card = styled(MuiCard)(({ theme }) => ({
    display: "flex",
    flexDirection: "column",
    alignSelf: "center",
    width: "100%",
    padding: theme.spacing(4),
    gap: theme.spacing(2),
    margin: "auto",
    [theme.breakpoints.up("sm")]: {
        maxWidth: "450px",
    },
    boxShadow:
        "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
}));

const SignInContainer = styled(Stack)(({ theme }) => ({
    position: "relative",
    minHeight: "100vh",
    padding: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
        padding: theme.spacing(4),
    },
    "&::before": {
        content: '""',
        display: "block",
        position: "absolute",
        zIndex: -1,
        inset: 0,
        backgroundImage:
            "radial-gradient(ellipse at 50% 50%, hsl(210, 100%, 97%), hsl(0, 0%, 100%))",
        backgroundRepeat: "no-repeat",
    },
}));

const validationSchema = yup.object({
    email: yup
        .string()
        .email("Невірний email")
        .required("Потрібно ввести email"),
    password: yup
        .string()
        .min(6, "Мінімум 6 символів")
        .required("Потрібно ввести пароль"),
});

function SignInPage() {
    const { login, googleLogin } = useAction();
    const clientId = import.meta.env.VITE_CLIENT_ID;
    //const clientId = "1031539308106-5h7h65eh4s53dok7oma8eaj0hn2u2an4.apps.googleusercontent.com"
    const navigate = useNavigate();

    const [errorMessage, setErrorMessage] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const formik = useFormik({
        initialValues: { email: "", password: "" },
        validationSchema,
        onSubmit: async (values) => {
            setErrorMessage("");
            setSubmitting(true);
            try {
                await login(values);
                navigate("/");
            } catch (err) {
                console.error("Login failed", err);
                setErrorMessage("Не вдалось увійти. Перевірте email і пароль.");
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <GoogleOAuthProvider clientId={clientId}>
            <CssBaseline enableColorScheme />
            <SignInContainer
                direction="column"
                justifyContent="center"
                alignItems="center"
            >
                <Card variant="outlined">
                    <Box sx={{ textAlign: "center" }}>
                        <Avatar sx={{ margin: "auto", bgcolor: "primary.main" }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h4" sx={{ mt: 1, mb: 2 }}>
                            Sign in
                        </Typography>
                    </Box>

                    <Box
                        component="form"
                        noValidate
                        onSubmit={formik.handleSubmit}
                        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                        {errorMessage && (
                            <Typography color="error" variant="body2">
                                {errorMessage}
                            </Typography>
                        )}

                        <FormControl fullWidth>
                            <FormLabel htmlFor="email">Email</FormLabel>
                            <TextField
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                fullWidth
                                variant="outlined"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(formik.touched.email && formik.errors.email)}
                                helperText={
                                    formik.touched.email && formik.errors.email
                                        ? formik.errors.email
                                        : ""
                                }
                            />
                        </FormControl>

                        <FormControl fullWidth>
                            <FormLabel htmlFor="password">Password</FormLabel>
                            <TextField
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                fullWidth
                                variant="outlined"
                                value={formik.values.password}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                error={Boolean(
                                    formik.touched.password && formik.errors.password
                                )}
                                helperText={
                                    formik.touched.password && formik.errors.password
                                        ? formik.errors.password
                                        : ""
                                }
                            />
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" />}
                            label="Remember me"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={submitting || !formik.isValid}
                        >
                            {submitting ? "Signing in..." : "Sign in"}
                        </Button>

                        <Link
                            component="button"
                            type="button"
                            variant="body2"
                            sx={{ alignSelf: "center" }}
                        >
                            Forgot your password?
                        </Link>
                    </Box>

                    <Divider sx={{ my: 2 }}>or</Divider>

                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                        <GoogleLogin
                            onSuccess={async (credentialResponse) => {
                                try {
                                    console.log("Google credential response:", credentialResponse);
                                    const idToken = credentialResponse.credential;
                                    const decoded = jwtDecode(idToken);
                                    console.log("Decoded Google token:", decoded);

                                    // Створюємо об'єкт з даними для нашого API
                                    const googleData = {
                                        idToken: idToken,
                                        googleId: decoded.sub, // Google ID користувача
                                        firstName: decoded.given_name,
                                        lastName: decoded.family_name,
                                        email: decoded.email,
                                        picture: decoded.picture
                                    };

                                    await googleLogin(googleData);
                                    navigate("/");
                                } catch (err) {
                                    console.error("Google login failed:", err);
                                    setErrorMessage(`Помилка входу через Google: ${err.message}`);
                                }
                            }}
                            onError={() => {
                                console.error("Google login error");
                                setErrorMessage("Не вдалося увійти через Google.");
                            }}
                            useOneTap
                        />

                        <Typography sx={{ textAlign: "center" }}>
                            Don&apos;t have an account? <Link href="/sign-up">Sign up</Link>
                        </Typography>
                    </Box>
                </Card>
            </SignInContainer>
        </GoogleOAuthProvider>
    );
}

export default SignInPage;
