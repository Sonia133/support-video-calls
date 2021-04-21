import React, { useState } from "react";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TablePagination from '@material-ui/core/TablePagination';

const CommentsTable = (props) => {
    const comments = props.comments;
    const rowsPerPage = 3;
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    return (
        <TableContainer component={Paper}>
            <Table stickyHeader aria-label="sticky table">
                <TableHead>
                    <TableRow>
                        <TableCell>Comment</TableCell>
                        <TableCell align="right">Employee</TableCell>
                        <TableCell align="right">Company</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {comments.map((comment, index) => (
                        <TableRow key={index}>
                            <TableCell component="th" scope="row">
                                {comment[0]}
                            </TableCell>
                            <TableCell align="right">{comment[1]}</TableCell>
                            <TableCell align="right">{comment[2]}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default CommentsTable;