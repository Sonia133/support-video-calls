import React, { useState } from "react";
import { 
    DialogContent, 
    DialogContentText,
    Typography,
    Box,
    Divider,
    Link,
    CircularProgress
} from '@material-ui/core';

const StaticProfile = (props) => {
    const user = props.user;
    const role = user.employeeId === undefined ? "ceo" : "employee";
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
            <img src={user.imageUrl} alt="profile" className="profile-image" style={{ display: loadPicture }}/>
            <DialogContentText style={{ width: "100%" }}>
                <Divider variant="middle"/>
                <div className="dialog-text">
                    <Typography>{user.firstname + " " + user.lastname}</Typography>
                    {user.role !== 'admin' ?(<Typography>{role + " @ " + user.companyName}</Typography>)
                        : (<Typography>{"admin @ SupportVideoCalls"}</Typography>)
                    }
                </div>
            </DialogContentText>
            {(role === 'employee' && user.schedule.length !== 0) && (
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
            {(role === 'employee' && user.schedule.length === 0) && (
                <Typography>This employee has not boarded yet. No schedule avilable!</Typography>
            )}
        </DialogContent>
    )
}

export default StaticProfile;