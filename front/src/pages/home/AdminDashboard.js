import { Box, CircularProgress, Button } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Profile from "../../components/Profile/Profile";
import { getCalls, getCallsPerCompany, getCallsPerEmployee } from "../../redux/actions/callActions";
import { getCeo, getCeos, deleteCeo } from "../../redux/actions/ceoActions";
import { getEmployee, getEmployees } from "../../redux/actions/employeeActions";

const AdminDashboard = () => {
    const { loading } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const getCalls1 = () => {
        dispatch(getCalls());
    }

    const getCalls2 = () => {
        dispatch(getCallsPerCompany('company1'));
    }

    const getCalls3 = () => {
        dispatch(getCallsPerEmployee('company1', 'employee12suppvc@gmail.com'));
    }

    const getCeos1 = () => {
        dispatch(getCeos());
    }

    const getCeos2 = () => {
        dispatch(getCeo('ceo1suppvc@gmail.com'));
    }

    const getEmployees1 = () => {
        dispatch(getEmployees('company1'));
    }

    const getEmployees2 = () => {
        dispatch(getEmployee('company2', 'employee21suppvc@gmail.com'));
    }

    return (
        <Box>
            {loading &&  (
                <CircularProgress />
            )}
            {!loading && (
                <Profile />
            )}
            <Button onClick={getCalls1}>Get calls</Button>
            <Button onClick={getCalls2}>Get Calls per company</Button>
            <Button onClick={getCalls3}>Get calls per employee</Button>
            <Button onClick={getCeos1}>Get ceos</Button>
            <Button onClick={getCeos2}>Get ceo</Button>
            <Button onClick={getEmployees1}>Get employees</Button>
            <Button onClick={getEmployees2}>Get employee</Button>
        </Box>
    );
}

export default AdminDashboard; 