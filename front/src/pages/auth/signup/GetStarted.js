import {
    Box,
    Button,
    TextField,
    Typography
} from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { sendRegisterRequest } from "../../../redux/actions/userActions";

const GetStarted = () => {
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const { loading, error } = useSelector((state) => state.ui);
    let [enrolled, setEnrolled] = useState(false);

    const onSubmit = (formData) => {
        formData.role = "ceo";
        console.log(formData);
        dispatch(sendRegisterRequest(formData));
        if (!!error) {
            setEnrolled(false);
        } else {
            setEnrolled(true);
        }
    };

    let render;
    if (enrolled) {
        render = (
            <Typography>Enrolled succesfully! Now check your email for the next step!</Typography>
        );
    }
    else {
        render = (
            <Box
                my={4}
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="center"
            >
                <TextField
                    error={!!errors.email?.message}
                    helperText={errors.email?.message ?? ""}
                    name="email"
                    inputRef={register({ required: "Email is required" })}
                    variant="outlined"
                    placeholder="Enter email"
                />
                <TextField
                    error={!!errors.companyName?.message}
                    helperText={errors.companyName?.message ?? ""}
                    name="companyName"
                    inputRef={register({ required: "Company name is required" })}
                    variant="outlined"
                    placeholder="Enter company name"
                />
                {!!error?.error && (
                    <Typography color="error">{error.error}</Typography>
                )}
                <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
                    <Typography>Get Started</Typography>
                </Button>
            </Box>
        );
    }
    
    return render;
}

export default GetStarted;