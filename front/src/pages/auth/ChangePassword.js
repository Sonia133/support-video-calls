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
import { useHistory } from "react-router";
import { changePassword } from '../../redux/actions/userActions';

const ChangePassword = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const { error, loading } = useSelector((state) => state.user)
    const { loading: loadingUi } = useSelector((state) => state.ui);
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
            setShowError("");
        }
    }, [error]);

    const onToggleVisibility1  = () => {
        setShowPassword1(!showPassword1);
    }

    const onToggleVisibility2  = () => {
        setShowPassword2(!showPassword2);
    }

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
                            type={showPassword1 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: 
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={onToggleVisibility1}
                                    >
                                      {showPassword1 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                            }}
                            InputLabelProps={{shrink: true }}
                        />
                        <TextField
                            error={!!errors.newPassword?.message}
                            helperText={errors.newPassword?.message ?? ""}
                            label="New password"
                            name="newPassword"
                            inputRef={register({ required: "New password is required" })}
                            variant="outlined"
                            type={showPassword2 ? 'text' : 'password'}
                            InputProps={{
                                endAdornment: 
                                  <InputAdornment position="end">
                                    <IconButton
                                      onClick={onToggleVisibility2}
                                    >
                                      {showPassword2 ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                  </InputAdornment>
                            }}
                            InputLabelProps={{shrink: true }}
                        />
                        {showError !== "" && (
                            <Typography color="error">{showError}</Typography>
                        )}
                        <div className="buttons-container">
                            <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                                {loading ? <CircularProgress /> : <Typography>Change</Typography>}
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

export default ChangePassword;