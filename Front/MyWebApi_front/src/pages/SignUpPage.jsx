import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {useNavigate } from "react-router-dom";
import { useAction } from "../hooks/useAction";
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

function SignUpForm() {
    const navigate = useNavigate();
    const { signUp, googleLogin } = useAction();
    //const clientId = import.meta.env.VITE_CLIENT_ID;
    const clientId = "1031539308106-5h7h65eh4s53dok7oma8eaj0hn2u2an4.apps.googleusercontent.com";

    const initFormValues = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      email: "",
      userName: "",
      password: "",
      repeatPassword: "",
      rememberMe: false
    }

    function submitHandler(values) {
        signUp(values);
        navigate("/");
    }

    function googleOnSuccessHandler(credentials) {
      try {
        const decoded = jwtDecode(credentials.credential);

        // Створюємо об'єкт з даними для нашого API
        const googleData = {
          idToken: credentials.credential,
          firstName: decoded.given_name,
          lastName: decoded.family_name,
          email: decoded.email,
          picture: decoded.picture
        };

        // Викликаємо наш Google login API
        googleLogin(googleData);
        navigate("/");
      } catch (error) {
        console.error("Error processing Google login:", error);
      }
  }

    function googleOnErrorHandler(error) {
        console.error(error);
    }

    const validationSchema = Yup.object({
      phoneNumber: Yup.string()
        .trim()
        .matches(/^[0-9]{10}$/, "Номер телефону повинен складатися з 10 цифр")
        .required("Поле обов'язкове"),

      email: Yup.string()
        .email("Невірний формат пошти")
        .required("Поле обов'язкове"),

      password: Yup.string()
        .min(6, "Пароль повинен містити не менше 6 символів")
        .required("Поле обов'язкове"),

      repeatPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], "Паролі повинні співпадати")
        .required("Поле обов'язкове"),
    });

    const formik = useFormik({
        initialValues: initFormValues,
        onSubmit: submitHandler,
        validationSchema: validationSchema
    })

    return (
      <GoogleOAuthProvider clientId={clientId}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Реєстрація
          </Typography>
          <form noValidate onSubmit={formik.handleSubmit}>
            <Grid container spacing={2} sx={{ mt: 3 }}>
              <Grid item xs={10}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Прізвище"
                  name="lastName"
                  autoComplete="family-name"
                  autoFocus
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="Ім'я"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="userName"
                  label="Псевдонім"
                  name="userName"
                  autoComplete="userName"
                  value={formik.values.userName}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="phoneNumber"
                  label="Номер телефону"
                  name="phoneNumber"
                  autoComplete="phoneNumber"
                  value={formik.values.phoneNumber}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.phoneNumber && formik.errors.phoneNumber ? (
                  <div style={{ color: "red" }}>{formik.errors.phoneNumber}</div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Адреса електронної пошти"
                  name="email"
                  autoComplete="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.email && formik.errors.email ? (
                    <div style={{color: "red"}}>{formik.errors.email}</div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Пароль"
                  type="password"
                  id="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.password && formik.errors.password ? (
                    <div style={{color: "red"}}>{formik.errors.password}</div>
                ) : null}
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="repeatPassword"
                  label="Повторіть пароль"
                  type="password"
                  id="repeatPassword"
                  value={formik.values.repeatPassword}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.touched.repeatPassword && formik.errors.repeatPassword ? (
                  <div style={{color: "red"}}>{formik.errors.repeatPassword}</div>
                ) : null}
                <FormControlLabel
                  control={
                    <Checkbox
                      name="rememberMe"
                      color="primary"
                      checked={formik.values.rememberMe}
                      onChange={formik.handleChange}
                    />
                  }
                  label="Запам'ятати мене"
                />
              </Grid>
            </Grid>
            <div sx={{mb: 15}}>
              <GoogleLogin
                  width="395"
                  onSuccess={googleOnSuccessHandler}
                  onError={googleOnErrorHandler}/>
            </div>
            <Button
                disabled={!formik.isValid && formik.dirty}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
            >
              Зареєструватися
            </Button>
          </form>
        </Box>
      </Container>
      </GoogleOAuthProvider>
  );
}

export default SignUpForm;