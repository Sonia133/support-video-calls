import { Box, Button, CircularProgress, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { sendFeedback } from "../../redux/actions/callActions";

const Feedback = () => {
    const { roomName } = useParams();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const [sent, setSent] = useState(false);
    const { error, loading } = useSelector((state) => state.ui);

    const onSubmit = (formData) => {
        if (formData.comments === undefined || formData.comments === null) {
            formData.comments = '';
        }
        formData.roomName = roomName;
        console.log(formData)
        setSent(true);
        dispatch(sendFeedback(formData));
    }

    return (
        <Box>
            {sent && (
                <Typography>Thank you for your time! Feedback sent successfully!</Typography>
            )}
            {!sent && (
                <Box
                    my={4}
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    >
                    <TextField
                        error={!!errors.feedback?.message}
                        helperText={errors.feedback?.message ?? ""}
                        name="feedback"
                        inputRef={register({ required: "Feedback is required" })}
                        variant="outlined"
                        placeholder="Enter feedback"
                        type="number"
                    />
                    <TextField
                        error={!!errors.comments?.message}
                        helperText={errors.comments?.message ?? ""}
                        name="comments"
                        inputRef={register({})}
                        variant="outlined"
                        placeholder="Enter comments"
                        type="comments"
                    />
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading}>
                        {loading ? <CircularProgress /> : <Typography>Send feedback</Typography>}
                    </Button>
                </Box>
                    
            )}
        </Box>
    )
}

export default Feedback;