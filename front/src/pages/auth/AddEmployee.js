import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography,
    Grow
} from "@material-ui/core";
import React, { useState, useEffect } from "react";
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

    const onSubmitEmployee = (formData) => {
        formData.role = "employee";
        formData.companyName = companyName;

        dispatch(sendRegisterRequest(formData, history));
    };

    const onClose = () => {
        history.push('/');
    }

    return (
        <Box style={{height: "100%", display: "flex", justifyContent: "center"}}>
            <Grow in>
                <Box
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
                    {showError !== "" && (
                        <Typography color="error">{showError}</Typography>
                    )}
                    <div className="buttons-container">
                        <Button onClick={handleSubmit(onSubmitEmployee)} disabled={loading} variant="contained" color="primary">
                            {loading ? <CircularProgress /> : <Typography>Submit</Typography>}
                        </Button>
                        <Button className="close-button" onClick={onClose} variant="contained" color="secondary">
                            <Typography>Close</Typography>
                        </Button>
                    </div>
                </Box>
            </Grow>
        </Box>
    )
}

export default AddEmployee;