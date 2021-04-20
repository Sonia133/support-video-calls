import React from "react";
import { Box, Tooltip, CircularProgress, IconButton } from "@material-ui/core";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import Profile from "../../../components/Profile/Profile";
import PersonAddIcon from '@material-ui/icons/PersonAdd';

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
                    <Profile />
                    <Tooltip title="Add employee" placement="top">
                        <IconButton onClick={addNewEmployee}>
                            <PersonAddIcon fontSize="large" style={{ color: "whitesmoke" }} />
                        </IconButton>
                    </Tooltip>
                </Box>
            )}
            {loading &&  (
                <CircularProgress />
            )}
        </Box>
    )
}

export default CeoHeader;