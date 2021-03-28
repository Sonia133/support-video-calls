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
import { signup, validateTokenEnroll } from "../../redux/actions/userActions";

const SignUp = () => {
  const history = useHistory();
  const { loading, error } = useSelector((state) => state.ui);
  const validatedToken = useSelector((state) => state.user.token);
  const dispatch = useDispatch();
  const { register, handleSubmit, errors } = useForm();
  const { token } = useParams();

  const onSubmit = (formData) => {
    console.log(formData);
    dispatch(signup(formData, token));
    console.log(!!error)
    if (!error) {
      history.push('/');
    }
  };

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
          <Box
            my={4}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <TextField
              error={!!errors.firstname?.message}
              helperText={errors.firstname?.message ?? ""}
              name="firstname"
              inputRef={register({ required: "First name is required" })}
              variant="outlined"
              placeholder="Enter first name"
            />
            <TextField
              error={!!errors.lastname?.message}
              helperText={errors.lastname?.message ?? ""}
              name="lastname"
              inputRef={register({ required: "Last name is required" })}
              variant="outlined"
              placeholder="Enter last name"
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
            <TextField
              error={!!errors.confirmPassword?.message}
              helperText={errors.confirmPassword?.message ?? ""}
              name="confirmPassword"
              inputRef={register({
                required: "Confirming your password is required"
              })}
              variant="outlined"
              placeholder="Confirm password"
              type="password"
            />
            {!!error?.error && <Typography color="error">{error.error}</Typography>}
            <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
              {loading ? <CircularProgress /> : <Typography>Sign up</Typography>}
            </Button>
          </Box>
        );    
      } else if (!!error?.inexistent) {
        setRender(<Typography>Error 404! Page not found!</Typography>);
      }
  }, [error, loading, validatedToken])

  return render;
};

export default SignUp;
