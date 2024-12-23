import { useEffect } from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import ToggleButton from "../ToggleButton/ToggleButton";
import AppTheme from "../shared-theme/AppTheme";
import { Container, CssBaseline } from "@mui/material";
import AppAppBar from "../blog/components/AppAppBar";
import { setupSocketListeners } from "../../config/socketHandle";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import NewDevice from "./NewDevice/NewDevice";
import { Check } from "@phosphor-icons/react";
import { configAxios } from "../../config/axios";
import { setRows } from "../../redux/slice/app/socketSlice";
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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const Dashboard = (props: { disableCustomTheme?: boolean }) => {
  const dispatch = useDispatch();
  const rows = useSelector((state: RootState) => state.app.socket.rows);
  console.log(rows, "check rows");
  // For first time render dashboard
  useEffect(() => {
    const firstRender = async () => {
      const result = await configAxios.get("device/get_all_database");
      dispatch(setRows(result.data));
    };
    firstRender();
  });
  useEffect(() => {
    const cleanupSocketListeners = setupSocketListeners(dispatch);
    return cleanupSocketListeners;
  }, [dispatch]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: "flex", flexDirection: "column", my: 16, gap: 4 }}
      >
        <h1>Dashboard</h1>
        <NewDevice></NewDevice>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>Device ID</StyledTableCell>
                <StyledTableCell align="center">Timestamp</StyledTableCell>
                <StyledTableCell align="center">Status</StyledTableCell>
                <StyledTableCell align="center">Sensor</StyledTableCell>
                <StyledTableCell align="center">Available</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <StyledTableRow key={row.device_id}>
                  <StyledTableCell component="th" scope="row">
                    {row.device_id}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    {row.timestamp}
                  </StyledTableCell>
                  <StyledTableCell align="center">
                    <ToggleButton
                      status={!!parseInt(row.status)}
                      deviceID={row.device_id}
                    ></ToggleButton>
                  </StyledTableCell>
                  <StyledTableCell align="center">{row.sensor}</StyledTableCell>
                  <StyledTableCell align="center">
                    <Check></Check>
                  </StyledTableCell>
                </StyledTableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>
    </AppTheme>
  );
};

export default Dashboard;
