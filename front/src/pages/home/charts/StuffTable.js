import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

const StuffTable = () => {
    const { employees } = useSelector((state) => state.employee);
    const { ceos } = useSelector((state) => state.ceo);
    const { role } = useSelector((state) => state.user);
    const [staff, setStaff] = useState([]);
    const rowsPerPage = 3;
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    useEffect(() => {
      if (role === "admin") {
        setStaff(employees.concat(ceos));
      } else {
        setStaff(employees);
      }
    }, [employees, ceos]);

    return (
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell align="right">Role</TableCell>
                        <TableCell align="right">Company</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {staff.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((staffMember, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {staffMember.firstname + " " + staffMember.lastname}
                            </TableCell>
                            <TableCell align="right">{staffMember.employeeId === undefined ? "ceo" : "employee"}</TableCell>
                            <TableCell align="right">{staffMember.companyName}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[rowsPerPage]}
                component="div"
                count={employees.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={handleChangePage}
            />
        </TableContainer>
    );
};

export default StuffTable;