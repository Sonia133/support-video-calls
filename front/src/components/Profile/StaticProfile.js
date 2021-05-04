import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { 
    DialogContent, 
    DialogContentText,
    Typography,
    Box,
    Divider,
    Link,
    CircularProgress,
    Button
} from '@material-ui/core';

const StaticProfile = ({user, deleteStaff}) => {
    const { role } = useSelector((state) => state.user);
    const userRole = user.employeeId === undefined ? "ceo" : "employee";
    const email = user.email;
    const [loadPicture, setLoadPicture] = useState("none");
      
    setTimeout(() => {
        setLoadPicture("inline-block");
    }, 1000);

    const [openSchedule, setOpenSchedule] = useState(false);
    const openScheduleEmployee = () => {
        setOpenSchedule(!openSchedule);
    }

    return (
        <DialogContent>
            {loadPicture === "none" && <CircularProgress style={{ marginBottom: "5%" }}/>}
            <img src={user.imageUrl} alt="profile" className="static-profile-image" style={{ display: loadPicture }}/>
            <DialogContentText style={{ width: "100%" }}>
                <Divider variant="middle"/>
                <div className="dialog-text">
                    <Typography>{user.firstname + " " + user.lastname}</Typography>
                    <Typography>{userRole + " @ " + user.companyName}</Typography>
                    {userRole === 'employee' && user.feedback === 0 && (
                        <Typography>No feedback yet.</Typography>
                    )}
                    {userRole === 'employee' && user.feedback !== 0 && (
                        <Typography>Feedback: {user.feedback.toFixed(2)}</Typography>
                    )}
                </div>
            </DialogContentText>
            {(userRole === 'employee' && user.schedule.length !== 0) && (
                <Box style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Link onClick={openScheduleEmployee}>{openSchedule ? "Hide" : "See"} schedule</Link>
                    {openSchedule && (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", lineHeight: "0.3"}}>
                            <p>Monday: {user.schedule[0]}</p>
                            <p>Tuesday: {user.schedule[1]}</p>
                            <p>Wednesday: {user.schedule[2]}</p>
                            <p>Thursday: {user.schedule[3]}</p>
                            <p>Friday: {user.schedule[4]}</p>
                        </div>
                    )}
                </Box>
            )}
            {(userRole === 'employee' && user.schedule.length === 0) && (
                <Typography>This employee has not boarded yet. No schedule avilable!</Typography>
            )}
            {role !== "employee" && (
                <Button
                    style={{ marginTop: "5%" }} 
                    onClick={() => deleteStaff(userRole, email)} 
                    variant="contained" 
                    color="secondary"
                >
                    {`Delete ${userRole}`}
                </Button>
            )}
        </DialogContent>
    )
}

export default StaticProfile;