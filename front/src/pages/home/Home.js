import { Box } from "@material-ui/core";
import React from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import CeoHeader from "./headers/CeoHeader";
import EmployeeHeader from "./headers/EmployeeHeader";
import AdminHeader from "./headers/AdminHeader";

const Home = () => {
  const history = useHistory();
  const isLoggedIn = useSelector((state) => state.user.authenticated);
  const [isEmployee, isCeo, isAdmin, firstname] = useSelector((state) => [
    state.user?.role === "employee",
    state.user?.role === "ceo",
    state.user?.role === "admin",
    state.user?.firstname
  ]);

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn]);

  return (
    <div style={{ height: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Box style={{ width: '95%', height: "95%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "2%", borderRadius: "2%", backgroundColor: "lightsteelblue" }}>
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
        <Box style={{ height: "40%"}}></Box>
        <Box style={{ height: "40%", display: "flex", justifyContent: "space-between" }}>
          <Box style={{ width: "30%" }}></Box>
          <Box style={{ width: "30%" }}></Box>
          <Box style={{ width: "30%" }}></Box>
        </Box>
      </Box>
    </div>
  );
};

export default Home;
