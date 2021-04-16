import { Box, Typography, Button, TextField } from "@material-ui/core";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateSchedule } from "../../redux/actions/userActions";

const Schedule = () => {
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();
    const { role, error } = useSelector((state) => state.user);
    const { loading } = useSelector((state) => state.ui);

    const onLogout = () => {
        dispatch(logoutUser(role));
    }

    const onSubmitSchedule = (formData) => {
        let scheduleToSend = [];
        for (let i = 0; i < 5; i ++) {
            scheduleToSend[i] = `${formData[2*i+1]}-${formData[2*i+2]}`;
        }
        if (!!error) {
            dispatch(updateSchedule({ schedule: scheduleToSend }));
        }
    }

    return (
        <div style={{height: "100%", display: "flex"}}>
          <Box
              px={6}
              py={4}
              className="auth-container single"
          >
            <h2>Add your schedule</h2>
            <div>
              <TextField
                error={!!errors['1']?.message}
                helperText={errors['1']?.message ?? ""}
                label="Monday start"
                name="1"
                inputRef={register({ required: "Starting hour on monday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                error={!!errors['2']?.message}
                helperText={errors['2']?.message ?? ""}
                label="Monday end"
                name="2"
                inputRef={register({ required: "Ending hour on monday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
            </div>
            <div>
              <TextField
                error={!!errors['3']?.message}
                helperText={errors['3']?.message ?? ""}
                label="Tuesday start"
                name="3"
                inputRef={register({ required: "Starting hour on tuesday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                error={!!errors['4']?.message}
                helperText={errors['4']?.message ?? ""}
                label="Tuesday end"
                name="4"
                inputRef={register({ required: "Ending hour on tuesday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
            </div>
            <div>
              <TextField
                error={!!errors['5']?.message}
                helperText={errors['5']?.message ?? ""}
                label="Wednesday start"
                name="5"
                inputRef={register({ required: "Starting hour on wednesday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                error={!!errors['6']?.message}
                helperText={errors['6']?.message ?? ""}
                label="Wednesday end"
                name="6"
                inputRef={register({ required: "Ending hour on wednesday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
            </div>
            <div>
              <TextField
                error={!!errors['7']?.message}
                helperText={errors['7']?.message ?? ""}
                label="Thursday start"
                name="7"
                inputRef={register({ required: "Starting hour on thursday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                error={!!errors['8']?.message}
                helperText={errors['8']?.message ?? ""}
                label="Thursday end"
                name="8"
                inputRef={register({ required: "Ending hour on thursday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
            </div>
            <div>
              <TextField
                error={!!errors['9']?.message}
                helperText={errors['9']?.message ?? ""}
                label="Friday start"
                name="9"
                inputRef={register({ required: "Starting hour on friday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
              <TextField
                error={!!errors['10']?.message}
                helperText={errors['10']?.message ?? ""}
                label="Friday end"
                name="10"
                inputRef={register({ required: "Ending hour on friday is required" })}
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                type="number"
              />
            </div>
            {!!error?.error && (
              <Typography color="error">{error.error}</Typography>
            )}
            <Button 
              onClick={handleSubmit(onSubmitSchedule)} 
              disabled={loading} 
              variant="contained" 
              color="primary"
              style={{ marginTop: "2%" }}
            >
                <Typography>Submit schedule</Typography>
            </Button>
            <Button onClick={onLogout} variant="contained" color="secondary" style={{ marginTop: "6%" }}>
              <Typography>Logout</Typography>
            </Button>
          </Box>
        </div>
    );
}

export default Schedule;