import * as React from "react";
import { useState } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ToggleButton from "./ToggleButton/ToggleButton";
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 20,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const createData = (deviceID: string, status: string, createDate: string) => {
  return { deviceID, status, createDate };
};
const rows = [
  createData("Frozen yoghurt", "159", "1"),
  createData("Ice cream sandwich", "237", "2"),
  createData("Eclair", "262", "3"),
  createData("Cupcake", "305", "4"),
  createData("Gingerbread", "323", "5"),
];

const CustomizedTables = () => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Device ID</StyledTableCell>
            <StyledTableCell align="center">Status</StyledTableCell>
            <StyledTableCell align="center">Button</StyledTableCell>
            <StyledTableCell align="center">CreateDate</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.deviceID}>
              <StyledTableCell component="th" scope="row">
                {row.deviceID}
              </StyledTableCell>
              <StyledTableCell align="center">{row.status}</StyledTableCell>
              {/* Button for toggle led  */}
              <StyledTableCell align="center">
                <ToggleButton deviceID={row.deviceID}></ToggleButton>
              </StyledTableCell>
              <StyledTableCell align="center">{row.createDate}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default CustomizedTables;
