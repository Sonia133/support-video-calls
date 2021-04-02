import { Box, Button, CircularProgress, TextField, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import socket from "../../socket";
import { changeAvailability, logoutUser, sendRegisterRequest, updateSchedule, uploadImage } from "../../redux/actions/userActions";

const Home = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const [imageUrl, isEmployee, isCeo, isAdmin, email, companyName, schedule, loading, available, role] = useSelector((state) => [
    state.user.imageUrl,
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.admin === "admin",
    state.user?.email,
    state.user?.companyName,
    state.user?.schedule,
    state.user?.loading,
    state.user?.available,
    state.user?.role
  ]);
  const { loading: loadingUi, error } = useSelector((state) => state.ui);
  let [addEmployee, setAddEmployee] = useState(false);
  let [updated, setUpdated] = useState(false);
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

  const updateScheduleEmployee = () => {
    setUpdated(true);
  }

  const addNewEmployee = () => {
    setAddEmployee(true);
  }

  const onSubmitSchedule = (formData) => {
    let scheduleToSend = [];
    for (let i = 0; i < 5; i ++) {
      scheduleToSend[i] = `${formData[2*i+1]}-${formData[2*i+2]}`;
    }

    dispatch(updateSchedule({ schedule: scheduleToSend }));
    if (!!error) {
      setUpdated(false);
    } else {
      setUpdated(true);
    }
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

  const onChangePassword = () => {
    history.push('/changepassword');
  }

  const onLogout = () => {
    dispatch(logoutUser(role));
  }

  const onChangeAvailability = () => {
    dispatch(changeAvailability({ available: !available }));
  }

  const onImageChange = (event) => {
    const image = event.target.files[0];
    
    const formData = new FormData();
    formData.append('image', image, image.name);

    dispatch(uploadImage(formData));
  };

  const onEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn, isEmployee, schedule, updated, available]);

  return (
    <Box>
      <div>HOME</div>
      {isEmployee && loading && schedule.length === 0 && (
        <CircularProgress />
      )}
      {isEmployee && schedule.length === 0 && !updated && (
        <Box>
          <Button onClick={updateScheduleEmployee}>Update schedule</Button>
          {!!error?.error && (
            <Typography color="error">{error.error}</Typography>
          )}
        </Box>
      )}
      {isEmployee && schedule.length === 0 && updated && (
        <Box
          my={4}
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography>Monday</Typography>
          <TextField
              error={!!errors['1']?.message}
              helperText={errors['1']?.message ?? ""}
              name="1"
              inputRef={register({ required: "Starting hour on monday is required" })}
              variant="outlined"
              type="number"
          />
          <TextField
              error={!!errors['2']?.message}
              helperText={errors['2']?.message ?? ""}
              name="2"
              inputRef={register({ required: "Ending hour on monday is required" })}
              variant="outlined"
              type="number"
          />
          <Typography>Tuesday</Typography>
          <TextField
              error={!!errors['3']?.message}
              helperText={errors['3']?.message ?? ""}
              name="3"
              inputRef={register({ required: "Starting hour on tuesday is required" })}
              variant="outlined"
              type="number"
          />
          <TextField
              error={!!errors['4']?.message}
              helperText={errors['4']?.message ?? ""}
              name="4"
              inputRef={register({ required: "Ending hour on tuesday is required" })}
              variant="outlined"
              type="number"
          />
          <Typography>Wednesday</Typography>
          <TextField
              error={!!errors['5']?.message}
              helperText={errors['5']?.message ?? ""}
              name="5"
              inputRef={register({ required: "Starting hour on wednesday is required" })}
              variant="outlined"
              type="number"
          />
          <TextField
              error={!!errors['6']?.message}
              helperText={errors['6']?.message ?? ""}
              name="6"
              inputRef={register({ required: "Ending hour on wednesday is required" })}
              variant="outlined"
              type="number"
          />
          <Typography>Thursday</Typography>
          <TextField
              error={!!errors['7']?.message}
              helperText={errors['7']?.message ?? ""}
              name="7"
              inputRef={register({ required: "Starting hour on thursday is required" })}
              variant="outlined"
              type="number"
          />
          <TextField
              error={!!errors['8']?.message}
              helperText={errors['8']?.message ?? ""}
              name="8"
              inputRef={register({ required: "Ending hour on thursday is required" })}
              variant="outlined"
              type="number"
          />
          <Typography>Friday</Typography>
          <TextField
              error={!!errors['9']?.message}
              helperText={errors['9']?.message ?? ""}
              name="9"
              inputRef={register({ required: "Starting hour on friday is required" })}
              variant="outlined"
              type="number"
          />
          <TextField
              error={!!errors['10']?.message}
              helperText={errors['10']?.message ?? ""}
              name="10"
              inputRef={register({ required: "Ending hour on friday is required" })}
              variant="outlined"
              type="number"
          />
          {!!error?.error && (
              <Typography color="error">{error.error}</Typography>
          )}
          <Button onClick={handleSubmit(onSubmitSchedule)} disabled={loadingUi}>
              <Typography>Submit schedule</Typography>
          </Button>
        </Box>
      )}
      {isEmployee && (
        <Box>
          {!loading && (
          <Button onClick={onChangeAvailability}>Go {available === true? "busy" : "available"}</Button>)}
          {loading && (<CircularProgress/>)}
          {!!error?.error && (
            <Typography color="error">{error.error}</Typography>
          )}
        </Box>
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
      <Box>
        <img src={imageUrl} alt="profile"/>
        <input style={{display: 'none'}} type="file" id="imageInput" onChange={onImageChange}></input>
        <Button onClick={onEditPicture}>
          <Typography>Update image</Typography>
        </Button>
      </Box>
      <Button onClick={onChangePassword}>
        <Typography>Change password</Typography>
      </Button>
      <Button onClick={onLogout}>
        <Typography>Log out</Typography>
      </Button>
    </Box>
  );
};

export default Home;
