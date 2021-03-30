import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
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
        <Box>
            {loadingUi && (
                <CircularProgress />
            )}
            {(!loadingUi || loadingUi === undefined) && (
                <Box>
                    <TextField
                        error={!!errors.email?.message}
                        helperText={errors.email?.message ?? ""}
                        name="email"
                        inputRef={register({ required: "Email is required" })}
                        variant="outlined"
                        placeholder="Enter email"
                    />
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
                        {loading ? <CircularProgress /> : <Typography>Submit</Typography>}
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default ForgotPassword;