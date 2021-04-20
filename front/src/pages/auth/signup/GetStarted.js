import {
    Box,
    Button,
    CircularProgress,
    TextField,
    Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { sendRegisterRequest } from "../../../redux/actions/userActions";

const GetStarted = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const { loading, error } = useSelector((state) => state.ui);
    let [enrolled, setEnrolled] = useState(false);
    let [submitted, setSubmitted] = useState(false);
    const history = useHistory();

    const onSubmit = (formData) => {
        setSubmitted(true);

        formData.role = "ceo";
        dispatch(sendRegisterRequest(formData, history));
    };

    useEffect(() => {
        if (submitted && !loading) {
            if (error) {
                setEnrolled(false);
            } else {
                setEnrolled(true);
            }
        }
    }, [loading])

    let render;
    if (enrolled) {
        render = (
            <div style={{height: "100%", display: "flex"}}>
                <Box
                    px={6}
                    py={4}
                    className="auth-container"
                    style={{background: "#fff"}}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <Typography>Enrolled succesfully! Now check your email for the next step!</Typography>
                </Box>
            </div>
        );
    }
    else {
        render = (
            <div style={{height: "100%", display: "flex"}}>
                <Box
                    px={6}
                    py={4}
                    className="auth-container"
                    style={{background: "#fff"}}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                >
                    <h2>Register your company</h2>
                    <TextField
                        error={!!errors.email?.message}
                        helperText={errors.email?.message ?? ""}
                        label="Email"
                        name="email"
                        inputRef={register({ required: "Email is required" })}
                        variant="outlined"
                        InputLabelProps={{shrink: true }}
                    />
                    <TextField
                        error={!!errors.companyName?.message}
                        helperText={errors.companyName?.message ?? ""}
                        label="Company"
                        name="companyName"
                        inputRef={register({ required: "Company name is required" })}
                        variant="outlined"
                        InputLabelProps={{shrink: true }}
                    />
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    {!!error?.email && <Typography color="error">{error.email}</Typography>}
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                        {loading ? <CircularProgress /> : <Typography>Get started</Typography>}
                    </Button>
                    <p>Back to <a href="/login"> login</a>?</p>
                </Box>
            </div>
        );
    }
    
    return render;
}

export default GetStarted;