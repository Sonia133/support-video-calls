import { Box, Button, CircularProgress, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Rating from '@material-ui/lab/Rating';
import { sendFeedback } from "../../redux/actions/callActions";

const Feedback = () => {
    const { roomName, companyName } = useParams();
    const dispatch = useDispatch();
    const { register, handleSubmit, errors } = useForm();
    const [sent, setSent] = useState(false);
    const [value, setValue] = useState(0);
    const [hover, setHover] = useState(0);
    const { error, loading } = useSelector((state) => state.ui);

    const onSubmit = (formData) => {
        formData.feedback = value;
        if (formData.comments === undefined || formData.comments === null) {
            formData.comments = '';
        }
        formData.roomName = roomName;

        formData.call = {
            companyName
        }

        setSent(true);
        dispatch(sendFeedback(formData));
    }

    return (
        <div style={{height: "100%", display: "flex"}}>
            {sent && (
                <Box
                    px={6}
                    py={4}
                    className="auth-container single"
                >
                    <Typography>Thank you for your time! Feedback sent successfully!</Typography>
                </Box>
            )}
            {!sent && (
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
                    <h2>Rate us</h2>
                    <Rating
                        name="hover-feedback"
                        value={value}
                        onChange={(event, newValue) => {
                            setValue(newValue);
                        }}
                        onChangeActive={(event, newHover) => {
                            setHover(newHover);
                        }}
                        style={{ marginBottom: "10%" }}
                    />
                    <TextField
                        error={!!errors.comments?.message}
                        helperText={errors.comments?.message ?? ""}
                        label="Comments"
                        name="comments"
                        inputRef={register({})}
                        variant="outlined"
                        InputLabelProps={{ shrink: true }}
                    />
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    <Button onClick={handleSubmit(onSubmit)} disabled={loading} variant="contained" color="primary">
                        {loading ? <CircularProgress /> : <Typography>Send feedback</Typography>}
                    </Button>
                </Box>
            )}
        </div>
    )
}

export default Feedback;