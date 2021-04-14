import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { signup, validateTokenEnroll } from "../../../redux/actions/userActions";

const SignUp = () => {
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.ui);
  const validatedToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const { token } = useParams();
  console.log('heree')

  const onSubmit = (formData) => {
    console.log(formData);
    dispatch(signup(formData, token, history));
  };

  const goLogin = () => {
    history.push("/login");
  }

  let renderInitial = <CircularProgress />;

  let [render, setRender] = useState(renderInitial);

  useEffect(() => {
    dispatch(validateTokenEnroll(token));
  }, []);

  useEffect(() => {
    if (validatedToken === undefined && loading) {
      setRender(<CircularProgress /> );
    } else if (validatedToken !== undefined){
      setRender(
        <div style={{height: "100%", display: "flex"}}>
          <Box
            className="auth-container"
          >
            <Box 
              className="alternative-auth-box"
              p={6}
            >
              <h1 style={{color: "#fff"}}>Welcome Back!</h1>
              <p style={{color: "#fff", textAlign: "center"}}>To keep connected with us please login with your personal info.</p>
                <Button onClick={goLogin} variant="contained">
                  <Typography>Sign in</Typography>
                </Button>
            </Box>
            <Box
              className="auth-box"
              p={6}
              style={{borderRadius: "0 2% 2% 0"}}
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
            >
              <h2>Sign up</h2>
              <TextField
                error={!!errors.firstname?.message}
                helperText={errors.firstname?.message ?? ""}
                label="First name"
                name="firstname"
                inputRef={register({ required: "First name is required" })}
                variant="outlined"
                InputLabelProps={{shrink: true }}
              />
              <TextField
                error={!!errors.lastname?.message}
                helperText={errors.lastname?.message ?? ""}
                label="Last name"
                name="lastname"
                inputRef={register({ required: "Last name is required" })}
                variant="outlined"
                InputLabelProps={{shrink: true }}
              />
              <TextField
                error={!!errors.password?.message}
                helperText={errors.password?.message ?? ""}
                label="Password"
                name="password"
                inputRef={register({ required: "Password is required" })}
                variant="outlined"
                type="password"
                InputLabelProps={{shrink: true }}
              />
              <TextField
                error={!!errors.confirmPassword?.message}
                helperText={errors.confirmPassword?.message ?? ""}
                label="Confirm password"
                name="confirmPassword"
                inputRef={register({
                  required: "Confirming your password is required"
                })}
                variant="outlined"
                type="password"
                InputLabelProps={{shrink: true }}
              />
              {!!error?.error && <Typography color="error">{error.error}</Typography>}
              <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                {loading ? <CircularProgress /> : <Typography>Sign up</Typography>}
              </Button>
            </Box>
          </Box>
        </div>
        );    
      } else if (!!error?.inexistent) {
        setRender(<p style={{color: "#fff"}}>Error 404! Page not found!</p>);
      }
  }, [error, loading, validatedToken])

  return render;
};

export default SignUp;
