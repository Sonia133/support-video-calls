import React from "react";
import { Box, CircularProgress } from "@material-ui/core";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import Profile from "../../../components/Profile/Profile";
import socket from "../../../socket";
import Schedule from "../../../components/Profile/Schedule";

const EmployeeDashboard = () => {
    const history = useHistory();
    const { email, companyName, loading, boarded } = useSelector((state) => state.user);

    useEffect(() => {
        socket
        .ref(`calls/${email.replace(".", "-")}/roomId`)
        .on("value", (snapshot) => {
            if (snapshot.val() !== '' && snapshot.val() !== null) {
                history.push(`/call/${companyName}`);
            } else {
                history.push('/');
            }
        });
      }, []);
    return (
        <Box>
            {loading &&  (
                <CircularProgress />
            )}
            {!boarded && (
                <Schedule />
            )}
            {boarded && !loading && (
                <Profile />
            )}
        </Box>
    );
}

export default EmployeeDashboard;