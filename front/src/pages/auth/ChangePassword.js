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
import { changePassword } from '../../redux/actions/userActions';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const { error, loading } = useSelector((state) => state.user)
    const { loading: loadingUi } = useSelector((state) => state.ui);

    const onSubmit = (formData) => {
        console.log(loadingUi)
        dispatch(changePassword(formData, history));
    }

    return (
        <Box>
            {loadingUi && (
                <CircularProgress />
            )}
            {(!loadingUi || loadingUi === undefined) && (
                <Box>
                    <TextField
                        error={!!errors.oldPassword?.message}
                        helperText={errors.oldPassword?.message ?? ""}
                        name="oldPassword"
                        inputRef={register({ required: "Old password is required" })}
                        variant="outlined"
                        placeholder="Enter old password"
                        type="password"
                    />
                    <TextField
                        error={!!errors.newPassword?.message}
                        helperText={errors.newPassword?.message ?? ""}
                        name="newPassword"
                        inputRef={register({ required: "New password is required" })}
                        variant="outlined"
                        placeholder="Enter new password"
                        type="password"
                    />
                    {!!error?.password && (
                        <Typography color="error">{error.password}</Typography>
                    )}
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

export default ChangePassword;