import { Box } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import CeoDashboard from "./CeoDashboard";
import EmployeeDashboard from "./EmployeeDashboard";
import AdminDashboard from "./AdminDashboard";

const Home = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const [isEmployee, isCeo, isAdmin] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.role === "admin"
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn]);

  return (
    <Box style={{height: "100%"}}>
      {isAdmin && (
        <AdminDashboard />
      )}
      {isCeo && (
        <CeoDashboard />
      )}
      {isEmployee && (
        <EmployeeDashboard />
      )}
    </Box>
  );
};

export default Home;
