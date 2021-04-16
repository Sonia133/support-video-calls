import { Box, Button, CircularProgress, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import socket from "../../socket";
import { sendRegisterRequest } from "../../redux/actions/userActions";
import Profile from "../../components/Profile/Profile";
import Schedule from "../../components/Profile/Schedule";

const Home = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const [isEmployee, isCeo, isAdmin, email, companyName, schedule, loading, boarded] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.admin === "admin",
    state.user?.email,
    state.user?.companyName,
    state.user?.schedule,
    state.user?.loading,
    state.user?.boarded
  ]);
  const { loading: loadingUi, error } = useSelector((state) => state.ui);
  let [addEmployee, setAddEmployee] = useState(false);
  const { register, handleSubmit, errors } = useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    if (isEmployee) {
      socket
        .ref(`calls/${email.replace(".", "-")}/roomId`)
        .on("value", (snapshot) => {
          if (snapshot.val() !== '' && snapshot.val() !== null) {
            history.push(`/call/${companyName}`);
          } else {
            history.push('/');
          }
        });
    }
  }, [isEmployee]);

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

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn, isEmployee, schedule]);

  return (
    <Box style={{height: "100%"}}>
      {loading &&  (
        <CircularProgress />
      )}
      {isEmployee && !boarded && (
        <Schedule />
      )}
      {(boarded || !isEmployee) && !loading && (
        <Profile />
      )}
      {isCeo && !addEmployee && (
        <Box>
          <Button onClick={addNewEmployee}>Add employee</Button>
          {!!error?.error && (
            <Typography color="error">{error.error}</Typography>
          )}
        </Box>
      )}
      {isCeo && addEmployee && (
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
  );
};

export default Home;
