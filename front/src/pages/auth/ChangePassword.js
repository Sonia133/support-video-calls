import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Grow
  } from "@material-ui/core";
import React, { useEffect, useState } from "react";
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

    const [showError, setShowError] = useState("");

    useEffect(() => {
        if (error) {
            for(let key in error) {
                setShowError(error[key]);
                break;
            }
        }
    }, [error]);

    const onSubmit = (formData) => {
        dispatch(changePassword(formData, history));
    }

    const onClose = () => {
        history.push('/');
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
                        <h2>Change your password</h2>
                        <TextField
                            error={!!errors.oldPassword?.message}
                            helperText={errors.oldPassword?.message ?? ""}
                            label="Old password"
                            name="oldPassword"
                            inputRef={register({ required: "Old password is required" })}
                            variant="outlined"
                            type="password"
                            InputLabelProps={{shrink: true }}
                        />
                        <TextField
                            error={!!errors.newPassword?.message}
                            helperText={errors.newPassword?.message ?? ""}
                            label="New password"
                            name="newPassword"
                            inputRef={register({ required: "New password is required" })}
                            variant="outlined"
                            type="password"
                            InputLabelProps={{shrink: true }}
                        />
                        {showError !== "" && (
                            <Typography color="error">{showError}</Typography>
                        )}
                        <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                            {loading ? <CircularProgress /> : <Typography>Change</Typography>}
                        </Button>
                        <Button style={{ marginTop: "3%" }} onClick={onClose} variant="contained" color="secondary">
                            <Typography>Close</Typography>
                        </Button>
                    </Box>
                </Grow>
            )}
        </Box>
    )
}

export default ChangePassword;