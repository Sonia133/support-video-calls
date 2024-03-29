import { Box, Typography, Button, TextField } from "@material-ui/core";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser, updateSchedule } from "../../redux/actions/userActions";

const Schedule = () => {
    const { register, handleSubmit, errors } = useForm();
    const dispatch = useDispatch();
    const { role, error } = useSelector((state) => state.user);
    const { loading } = useSelector((state) => state.ui);

    const [showError, setShowError] = useState("");

    useEffect(() => {
        if (error) {
            for(let key in error) {
                setShowError(error[key]);
                break;
            }
        } else {
          setShowError("");
        }
    }, [error])

    const onLogout = () => {
        dispatch(logoutUser(role));
    }

    const onSubmitSchedule = (formData) => {
        let scheduleToSend = [];
        for (let i = 0; i < 5; i ++) {
            scheduleToSend[i] = `${formData[2*i+1]}+${formData[2*i+2]}`;
        }
        dispatch(updateSchedule({ schedule: scheduleToSend }));
    }

    return (
        <div style={{height: "80%", display: "flex" }}>
          <Box
              className="auth-container single"
          >
            <h2>Add your schedule</h2>
            <div style={{ display: "flex" }}>
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
            <div style={{ display: "flex" }}>
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
            <div style={{ display: "flex" }}>
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
            <div style={{ display: "flex" }}>
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
            <div style={{ display: "flex" }}>
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
            {showError !== "" && (
                <Typography color="error">{showError}</Typography>
            )}
            <div className="buttons-container">
              <Button 
                onClick={handleSubmit(onSubmitSchedule)} 
                disabled={loading} 
                variant="contained" 
                color="primary"
              >
                  <Typography>Submit</Typography>
              </Button>
              <Button className="close-button" onClick={onLogout} variant="contained" color="secondary" >
                  <Typography>Logout</Typography>
              </Button>
            </div>
          </Box>
        </div>
    );
}

export default Schedule;