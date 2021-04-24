import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import StaticProfile from "../../../components/Profile/StaticProfile";
import { Button, Dialog } from "@material-ui/core";
import { ActionTypes } from "../../../redux/types";

const StuffTable = () => {
    const { employees } = useSelector((state) => state.employee);
    const { ceos } = useSelector((state) => state.ceo);
    const { role } = useSelector((state) => state.user);
    const [staff, setStaff] = useState([]);
    const [open, setOpen] = useState(false);
    const [user, setUser] = useState();
    const dispatch = useDispatch();


    const clickStaff = (staffMember) => {
      setUser(staffMember);
      setOpen(true);
    };

    const closeProfileDialog = () => {
      setOpen(false);
      setUser(undefined);
      dispatch({ type: ActionTypes.USER.CLEAR_ERRORS });
    }

    useEffect(() => {
      if (role === "admin") {
        setStaff(employees.concat(ceos));
      } else {
        setStaff(employees);
      }
    }, [employees, ceos]);

    return (
      <TableContainer component={Paper}>
          <Table stickyHeader aria-label="sticky table">
              <TableHead>
                  <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell align="right">Role</TableCell>
                      <TableCell align="right">Company</TableCell>
                  </TableRow>
              </TableHead>
              <TableBody className="staff-profile">
                  {staff.map((staffMember, index) => (
                    <TableRow key={index} onClick={() => clickStaff(staffMember)}>
                        <TableCell component="th" scope="row">
                            {staffMember.firstname + " " + staffMember.lastname}
                        </TableCell>
                        <TableCell align="right">{staffMember.employeeId === undefined ? "ceo" : "employee"}</TableCell>
                        <TableCell align="right">{staffMember.companyName}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
          </Table>
          {user !== undefined && (<Dialog
              open={open}
              keepMounted
              onClose={closeProfileDialog}
              aria-labelledby="alert-dialog-slide-title"
              aria-describedby="alert-dialog-slide-description"
          >
            <StaticProfile user={user} />
            <div style={{ display: "flex", justifyContent: "center" }}>
              <Button 
                style={{ marginBottom: "5%", marginTop: "5%" }} 
                onClick={closeProfileDialog} 
                variant="contained" 
                color="primary"
              >
              Close
            </Button>
          </div>
        </Dialog>)}
      </TableContainer>
    );
};

export default StuffTable;