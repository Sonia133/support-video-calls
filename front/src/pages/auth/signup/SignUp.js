import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
  Grow,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router";
import { signup, validateTokenEnroll } from "../../../redux/actions/userActions";

const SignUp = () => {
  const history = useHistory();
  const { loading: loadingUi, error: errorUi } = useSelector((state) => state.ui);
  const { loading, error, authenticated } = useSelector((state) => state.user);
  const validatedToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const { token } = useParams();
  const [showPassword1, setShowPassword1] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const [showError, setShowError] = useState("");

  useEffect(() => {
    if (error) {
        for(let key in error) {
            setShowError(error[key]);
            break;
        }
    } else {
      if (errorUi) {
        for(let key in errorUi) {
          setShowError(errorUi[key]);
          break;
        }
      } else {
        setShowError("");
      }
    }
  }, [error, errorUi]);

  const onToggleVisibility1 = () => {
    setShowPassword1(!showPassword1);
  }
  const onToggleVisibility2 = () => {
    setShowPassword2(!showPassword2);
  }

  const onSubmit = (formData) => {
    dispatch(signup(formData, token, history));
  };

  const goLogin = () => {
    history.push("/login");
  }

  useEffect(() => {
    if (authenticated) {
      history.push('/');
    }
  }, [authenticated])

  let renderInitial = <CircularProgress />;

  let [render, setRender] = useState(renderInitial);

  useEffect(() => {
    dispatch(validateTokenEnroll(token));
  }, []);

  useEffect(() => {
    console.log(loading)
    if (validatedToken === undefined && loadingUi) {
      setRender(<CircularProgress /> );
    } else if (validatedToken !== undefined){
      setRender(
        <div style={{height: "100%", display: "flex"}}>
          <Grow in>
            <Box
              className="auth-container signup"
            >
              <Box 
                className="alternative-auth-box alternative-signup-box"
                p={6}
              >
                <h1 style={{color: "#fff"}}>Welcome Back!</h1>
                <p style={{color: "#fff", textAlign: "center"}}>To keep connected with us please login with your personal info.</p>
                  <Button onClick={goLogin} variant="contained">
                    <Typography>Sign in</Typography>
                  </Button>
              </Box>
              <Box
                className="auth-box signup-box"
                p={6}
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
                  InputProps={{
                    endAdornment: 
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => onToggleVisibility1()}
                        >
                          {showPassword1 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                  }}
                  type={showPassword1 ? 'text' : 'password'}
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
                  InputProps={{
                    endAdornment: 
                      <InputAdornment position="end">
                        <IconButton
                          onClick={onToggleVisibility2}
                        >
                          {showPassword2 ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                  }}
                  variant="outlined"
                  type={showPassword2 ? 'text' : 'password'}
                  InputLabelProps={{shrink: true }}
                />
                {showError !== "" && <Typography color="error">{showError}</Typography>}
                <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                  {loading ? <CircularProgress /> : <Typography>Sign up</Typography>}
                </Button>
              </Box>
            </Box>
          </Grow>
        </div>
      );    
    } else if (!!errorUi?.inexistent) {
      setRender(<p style={{color: "#fff", marginLeft: "2%" }}>Error 404! Page not found!</p>);
    }
  }, [error, errors, errorUi, loading, loadingUi, validatedToken, showPassword1, showPassword2, showError])

  return render;
};

export default SignUp;
