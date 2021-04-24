import {
    Box,
    Button,
    CircularProgress,
    Grow,
    TextField,
    Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { changeAvailability, loginUser } from "../../../redux/actions/userActions";

const Login = () => {
  const history = useHistory();
  const { loading, error, authenticated, role, schedule } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();

  const [showError, setShowError] = useState("");

  useEffect(() => {
    if (error) {
        for(let key in error) {
            setShowError(error[key]);
            break;
        }
    }
  }, [error]);
  
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

  return (
    <div style={{height: "100%", display: "flex"}}>
      <Grow in>
        <Box 
          className="auth-container"
        >
          <Box
            className="auth-box"
            p={6}
            style={{borderRadius: "2% 0 0 2%"}}
          >
            <h2>Sign in</h2>
            <TextField
              label="Email"
              error={!!errors.email?.message}
              helperText={errors.email?.message ?? ""}
              name="email"
              inputRef={register({ required: "Email is required" })}
              variant="outlined"
              InputLabelProps={{shrink: true }}
            />
            <TextField
              label="Password"
              error={!!errors.password?.message}
              helperText={errors.password?.message ?? ""}
              name="password"
              inputRef={register({ required: "Password is required" })}
              variant="outlined"
              placeholder="Enter password"
              type="password"
              InputLabelProps={{shrink: true }}
            />
            {showError !== "" && (
                <Typography color="error">{showError}</Typography>
            )}
            <a href="/forgotpassword">Forgot your password?</a>
            <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
              {loading ? <CircularProgress /> : <Typography>Sign in</Typography>}
            </Button>
          </Box>
          <Box 
            className="alternative-auth-box"
            p={6}
          >
            <h1 style={{color: "#fff"}}>Hello, Friend!</h1>
            <p style={{color: "#fff", textAlign: "center"}}>Do you want to register your own company?</p>
              <Button onClick={onRequest} variant="contained">
                <Typography>Register</Typography>
              </Button>
          </Box>
        </Box>
      </Grow>
    </div>
  );
};

export default Login;
