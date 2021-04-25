import { Box, CircularProgress, Typography } from "@material-ui/core";
import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router";
import CeoHeader from "./headers/CeoHeader";
import EmployeeHeader from "./headers/EmployeeHeader";
import AdminHeader from "./headers/AdminHeader";
import CallChart from './charts/CallChart';
import FeedbackChart from './charts/FeedbackChart';
import StuffTable from './charts/StuffTable';
import { 
  getCalls,
  getCallsPerCompany,
  getCallsPerEmployee,
  getFeedback,
  getFeedbackPerCompany,
  getFeedbackPerEmployee
} from "../../redux/actions/callActions";
import { getEmployees, getAllEmployees } from "../../redux/actions/employeeActions";
import CommentsTable from "./charts/CommentsTable";
import { getCeos } from "../../redux/actions/ceoActions";

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const { loadingCalls, loadingFeedback, calls, feedback, comments, error: errorCall } = useSelector((state) => state.call);
  const { loading: loadingEmployees, error: errorEmployee } = useSelector((state) => state.employee);
  const { loading: loadingCeos, error: errorCeo } = useSelector((state) => state.ceo);
  const [isEmployee, isCeo, isAdmin, firstname, companyName, email, loading, error, boarded] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.role === "admin",
    state.user?.firstname,
    state.user?.companyName,
    state.user?.email,
    state.user?.loading,
    state.user?.error,
    state.user?.boarded
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }

    if (isEmployee) {
      dispatch(getCallsPerEmployee(companyName, email));
      dispatch(getFeedbackPerEmployee(companyName, email))
      dispatch(getEmployees(companyName));
    } else if (isAdmin) {
      dispatch(getCalls());
      dispatch(getFeedback());
      dispatch(getAllEmployees());
      dispatch(getCeos());
    } else if (isCeo) {
      dispatch(getCallsPerCompany(companyName));
      dispatch(getFeedbackPerCompany(companyName))
      dispatch(getEmployees(companyName));
    }

  }, [isLoggedIn, isEmployee, isCeo, isAdmin]);

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {!!error?.error && <Typography color="error">{error.error}</Typography>}
      {loading && (
        <CircularProgress />
      )}
      {!loading && (
        <Box style={{ width: '93%', height: "90%", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Box
            style={{ height: "12%" }}
            display="flex"
            alignItems="center"
            justifyContent="space-around"
          >
            <h2 style={{ color: "whitesmoke", marginBottom: "0px", marginTop: "0px" }}>Hi, {firstname}</h2>
            {isAdmin && (
              <AdminHeader />
            )}
            {isCeo && (
              <CeoHeader />
            )}
            {isEmployee && (
              <EmployeeHeader />
            )}
          </Box>
          {(boarded || boarded === undefined) && (
            <Box className="big-chart">
              {(loadingCalls || loadingCalls === undefined) && (<CircularProgress />)}
              {(!loadingCalls && loadingCalls !== undefined) && (<CallChart calls={calls}/>)}
              {!!errorCall?.error && <Typography color="error">{errorCall.error}</Typography>}
            </Box>
          )}
          {(boarded || boarded === undefined) && (
            <Box style={{ height: "43%", display: "flex", justifyContent: "space-between" }}>
              <Box className="small-chart">
                <h4>Comments</h4>
                {(loadingCalls || loadingCalls === undefined) && (<CircularProgress />)}
                {(!loadingCalls && loadingCalls !== undefined) && (<CommentsTable comments={comments}/>)}
                {!!errorCall?.error && <Typography color="error">{errorCall.error}</Typography>}    
              </Box>
              <Box className="small-chart" style={{ marginTop: "2%" }}>
                {(loadingFeedback || loadingFeedback === undefined) && (<CircularProgress />)}
                {(!loadingFeedback && loadingFeedback !== undefined) && (<FeedbackChart feedback={feedback}/>)}
                {!!errorCall?.error && <Typography color="error">{errorCall.error}</Typography>}
              </Box>
              {isAdmin && (
                <Box className="small-chart">
                  <h4>Staff</h4>
                  {((loadingCeos || loadingEmployees) || (loadingCeos === undefined || loadingEmployees === undefined))
                            && (<CircularProgress />)}
                  {((!loadingCeos && !loadingEmployees) && (loadingCeos !== undefined && loadingEmployees !== undefined))
                          && (<StuffTable />)}
                  {!!errorEmployee?.error && <Typography color="error">{errorEmployee.error}</Typography>}
                  {!!errorCeo?.error && <Typography color="error">{errorCeo.error}</Typography>}
                </Box>
              )}
              {!isAdmin && (
                <Box className="small-chart">
                  <h4>Staff</h4>
                  {(loadingEmployees || loadingEmployees === undefined)
                            && (<CircularProgress />)}
                  {(!loadingEmployees && loadingEmployees !== undefined)
                          && (<StuffTable />)}
                  {!!errorEmployee?.error && <Typography color="error">{errorEmployee.error}</Typography>}
                  {!!errorCeo?.error && <Typography color="error">{errorCeo.error}</Typography>}
                </Box>
              )}
            </Box>
          )}
        </Box>
      )}
    </div>
  );
};

export default Home;
