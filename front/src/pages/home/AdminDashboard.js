import { Box, CircularProgress } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import Profile from "../../components/Profile/Profile";


const AdminDashboard = () => {
    const { loading } = useSelector((state) => state.user);
    return (
        <Box>
            {loading &&  (
                <CircularProgress />
            )}
            {!loading && (
                <Profile />
            )}
        </Box>
    );
}

export default AdminDashboard; 