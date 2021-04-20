import React from "react";
import { Box, Button, CircularProgress } from "@material-ui/core";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import Profile from "../../../components/Profile/Profile";

const CeoHeader = () => {
    const [loading] = useSelector((state) => [
        state.user?.loading
    ]);
    const history = useHistory();

    const addNewEmployee = () => {
        history.push('/addemployee');
    }

    return (
        <Box>
            {!loading && (
                <Box style={{ display: "flex", alignItems: "center" }}>
                    <Button onClick={addNewEmployee} color="primary" variant="contained">Add employee</Button>
                    <Profile />
                </Box>
            )}
            {loading &&  (
                <CircularProgress />
            )}
        </Box>
    )
}

export default CeoHeader;