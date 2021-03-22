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
import { loginUser } from "../../redux/actions/authActions";

const Login = () => {
  const history = useHistory();
  const { loading, error, authenticated } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();

  useEffect(() => {
    if (authenticated) {
      history.push("/");
    }
  }, [authenticated]);

  const onSubmit = (formData) => {
    console.log(formData);
    dispatch(loginUser(formData));
  };

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
      {!!error?.general && (
        <Typography color="error">{error.general}</Typography>
      )}
      <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
        {loading ? <CircularProgress /> : <Typography>Login</Typography>}
      </Button>
    </Box>
  );
};

export default Login;
