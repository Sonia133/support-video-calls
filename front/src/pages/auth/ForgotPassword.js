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
import { forgotPassword } from '../../redux/actions/userActions';

const ForgotPassword = () => {
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
        } else {
            setShowError("");
        }
    }, [error]);

    const onSubmit = (formData) => {
        dispatch(forgotPassword(formData, history));
    }

    const onClose = () => {
        history.push('/login');
    }

    return (
        <Box style={{height: "100%", display: "flex"}}>
            {loadingUi && (
                <CircularProgress />
            )}
            {(!loadingUi || loadingUi === undefined) && (
                <Grow in>
                    <Box
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
                        {showError !== "" && (
                            <Typography color="error">{showError}</Typography>
                        )}
                        <div className="buttons-container">
                            <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                                {loading ? <CircularProgress /> : <Typography>Submit</Typography>}
                            </Button>
                            <Button className="close-button" onClick={onClose} variant="contained" color="secondary">
                                <Typography>Close</Typography>
                            </Button>
                        </div>
                    </Box>
                </Grow>
            )}
        </Box>
    )
}

export default ForgotPassword;