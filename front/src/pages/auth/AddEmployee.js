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
import { sendRegisterRequest } from '../../redux/actions/userActions';

const AddEmployee = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const history = useHistory();
    const { error, companyName } = useSelector((state) => state.user)
    const { loading, error: errorUi } = useSelector((state) => state.ui);

    const onSubmitEmployee = (formData) => {
        formData.role = "employee";
        formData.companyName = companyName;

        dispatch(sendRegisterRequest(formData, history));
    };

    const onClose = () => {
        history.push('/');
    }

    return (
        <Box style={{height: "100%", display: "flex"}}>
            <Box
                px={6}
                py={4}
                className="auth-container single"
            >
                <h2>Add an employee</h2>
                <TextField
                    error={!!errors.newPassword?.message}
                    helperText={errors.newPassword?.message ?? ""}
                    label="Email"
                    name="email"
                    inputRef={register({ required: "Email is required" })}
                    variant="outlined"
                    InputLabelProps={{shrink: true }}
                />
                {!!error?.error && (
                    <Typography color="error">{error.error}</Typography>
                )}
                {!!errorUi?.email && <Typography color="error">{errorUi.email}</Typography>}
                <Button onClick={handleSubmit(onSubmitEmployee)} disabled={loading} variant="contained" color="primary">
                    {loading ? <CircularProgress /> : <Typography>Submit employee</Typography>}
                </Button>
                <Button style={{ marginTop: "3%" }} onClick={onClose} variant="contained" color="secondary">
                    <Typography>Close</Typography>
                </Button>
            </Box>
        </Box>
    )
}

export default AddEmployee;