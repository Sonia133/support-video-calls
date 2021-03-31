import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography
} from "@material-ui/core";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { changeAvailability, loginUser } from "../../../redux/actions/userActions";

const Login = () => {
  const history = useHistory();
  const { loading, error, authenticated, role, schedule } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (authenticated) {
      history.push("/");
    }

    if (role === 'employee' && schedule !== []) {
      dispatch(changeAvailability({ available: true }));
    }
  }, [authenticated, role]);

  const onSubmit = (formData) => {
    dispatch(loginUser(formData));
  };

  const onRequest = () => {
      history.push("/getstarted");
  }

  const onForgotPassword = () => {
     history.push('/forgotpassword');
  }

  return (
    <Box
      my={4}
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
    >
      <TextField
        error={!!errors.email?.message}
        helperText={errors.email?.message ?? ""}
        name="email"
        inputRef={register({ required: "Email is required" })}
        variant="outlined"
        placeholder="Enter email"
      />
      <TextField
        error={!!errors.password?.message}
        helperText={errors.password?.message ?? ""}
        name="password"
        inputRef={register({ required: "Password is required" })}
        variant="outlined"
        placeholder="Enter password"
        type="password"
      />
      {!!error?.error && (
        <Typography color="error">{error.error}</Typography>
      )}
      <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <CircularProgress /> : <Typography>Login</Typography>}
      </Button>
      <Typography>Register your own company</Typography>
      <Button onClick={onRequest}>
        <Typography>Here</Typography>
      </Button>
      <Button onClick={onForgotPassword}>
        <Typography>You forgot your password?</Typography>
      </Button>
    </Box>
  );
};

export default Login;
