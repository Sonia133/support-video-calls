import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Grow
  } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { forgotPassword } from '../../redux/actions/userActions';

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const { error, loading } = useSelector((state) => state.user)
    const { loading: loadingUi } = useSelector((state) => state.ui);

    const onSubmit = (formData) => {
        dispatch(forgotPassword(formData, history));
    }

    return (
        <Box style={{height: "100%", display: "flex"}}>
            {loadingUi && (
                <CircularProgress />
            )}
            {(!loadingUi || loadingUi === undefined) && (
                <Grow in>
                    <Box
                        px={6}
                        py={4}
                        className="auth-container single"
                    >
                        <h2>Forgot your password?</h2>
                        <TextField
                            error={!!errors.email?.message}
                            helperText={errors.email?.message ?? ""}
                            label="Email"
                            name="email"
                            inputRef={register({ required: "Email is required" })}
                            variant="outlined"
                            InputLabelProps={{shrink: true}}
                        />
                        {!!error?.error && (
                            <Typography color="error">{error.error}</Typography>
                        )}
                        <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                            {loading ? <CircularProgress /> : <Typography>Submit</Typography>}
                        </Button>
                    </Box>
                </Grow>
            )}
        </Box>
    )
}

export default ForgotPassword;