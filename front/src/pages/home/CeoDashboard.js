import React, { useState } from "react";
import { Box, Button, Typography, TextField, CircularProgress } from "@material-ui/core";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../components/Profile/Profile";
import { sendRegisterRequest } from "../../redux/actions/userActions";

const CeoDashboard = () => {
    const [companyName, loading] = useSelector((state) => [
        state.user?.companyName,
        state.user?.loading
    ]);
    const { loading: loadingUi, error } = useSelector((state) => state.ui);
    let [addEmployee, setAddEmployee] = useState(false);
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();

    const addNewEmployee = () => {
        setAddEmployee(true);
    }
    
    const onSubmitEmployee = (formData) => {
        formData.role = "employee";
        formData.companyName = companyName;

        dispatch(sendRegisterRequest(formData));
        if (!!error) {
            setAddEmployee(false);
        } else {
            setAddEmployee(true);
        }
    };

    return (
        <Box>
            <Profile />
            {loading &&  (
                <CircularProgress />
            )}
            {!addEmployee && (
                <Box>
                    <Button onClick={addNewEmployee}>Add employee</Button>
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                </Box>
            )}
            {addEmployee && (
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
                    {!!error?.error && (
                        <Typography color="error">{error.error}</Typography>
                    )}
                    <Button onClick={handleSubmit(onSubmitEmployee)} disabled={loadingUi}>
                        <Typography>Submit employee</Typography>
                    </Button>
                </Box>
            )}
        </Box>
    )
}

export default CeoDashboard;