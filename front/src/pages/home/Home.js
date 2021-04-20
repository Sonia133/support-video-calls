import { Box, CircularProgress } from "@material-ui/core";
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

const Home = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const { loadingCalls, loadingFeedback, calls, feedback } = useSelector((state) => state.call);
  const [isEmployee, isCeo, isAdmin, firstname, companyName, email, loading] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.role === "admin",
    state.user?.firstname,
    state.user?.companyName,
    state.user?.email,
    state.user?.loading
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }

    if (isEmployee) {
      dispatch(getCallsPerEmployee(companyName, email));
      dispatch(getFeedbackPerEmployee(companyName, email))
    } else if (isAdmin) {
      dispatch(getCalls());
      dispatch(getFeedback());
    } else if (isCeo) {
      dispatch(getCallsPerCompany(companyName));
      dispatch(getFeedbackPerCompany(companyName))
    }

  }, [isLoggedIn, isEmployee, isCeo, isAdmin]);

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      {loading && (
        <CircularProgress />
      )}
      {!loading && (
        <Box style={{ width: '90%', height: "90%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "4%" }}>
          <Box
            style={{ height: "20%" }}
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
          <Box className="big-chart">
          {(loadingCalls || loadingCalls === undefined) && (<CircularProgress />)}
          {(!loadingCalls && loadingCalls !== undefined) && (<CallChart calls={calls}/>)}
          </Box>
          <Box style={{ height: "40%", display: "flex", justifyContent: "space-between" }}>
            <Box className="small-chart">
              {(loadingFeedback || loadingFeedback === undefined) && (<CircularProgress />)}
              {(!loadingFeedback && loadingFeedback !== undefined) && (<FeedbackChart feedback={feedback}/>)}
            </Box>
            <Box className="small-chart">
              {(loadingFeedback || loadingFeedback === undefined) && (<CircularProgress />)}
              {(!loadingFeedback && loadingFeedback !== undefined) && (<FeedbackChart feedback={feedback}/>)}            </Box>
            <Box className="small-chart">
              {(loadingFeedback || loadingFeedback === undefined) && (<CircularProgress />)}
              {(!loadingFeedback && loadingFeedback !== undefined) && (<FeedbackChart feedback={feedback}/>)}            </Box>
          </Box>
        </Box>
      )}
    </div>
  );
};

export default Home;
