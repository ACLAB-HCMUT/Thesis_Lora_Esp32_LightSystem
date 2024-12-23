import { useEffect, useState } from "react";
import { setupSocketListeners } from "../../config/socketHandle";
import AppTheme from "../shared-theme/AppTheme";
import { Container, CssBaseline, Grid } from "@mui/material";
import AppAppBar from "../blog/components/AppAppBar";
import { Active } from "./Item/Active";
import { Total } from "./Item/TotalNode";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { AverageSensor } from "./Item/AverageSensor";
import { DashboardSensor } from "./Item/DashboardSensor";
import { Danger } from "./Item/Danger";
import { configAxios } from "../../config/axios";
import { setTotalNode } from "../../redux/slice/app/socketSlice";
export const Statistical = (props: { disableCustomTheme?: boolean }) => {
  const dispatch = useDispatch();

  // Dashboard
  const [chartSeries, setChartSeries] = useState<
    { name: string; data: number[] }[]
  >([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceLists, setDeviceList] = useState<{ id: string; name: string }[]>(
    []
  );
  const createFormatDevice = (data: string[]) => {
    const format = data.map((item) => ({
      id: item,
      name: `Device ${item}`,
    }));

    return format;
  };

  useEffect(() => {
    // Sử dụng async/await để xử lý API call
    const fetchDeviceIds = async () => {
      try {
        const response = await configAxios.get("dynamodb/unique_deviceid");
        const format = createFormatDevice(response.data.deviceIds);
        setDeviceList(format);
      } catch (error) {
        console.error("Error fetching device IDs:", error);
      }
    };

    fetchDeviceIds();
  }, []);

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDevice(deviceId);
    console.log("Selected Device:", deviceId);
  };

  // Get data for dashboard
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await configAxios.get(
          `dynamodb/device_sensor_timestamp/${selectedDevice}`
        );
        const rawData = response.data;
        const newTimestamps = rawData.map((item: any) => item.timestamp.S);
        const newChartSeries = [
          {
            name: "Light Sensor Values",
            data: rawData.map((item: any) =>
              parseInt(item.light_sensor_value.S, 10)
            ),
          },
        ];

        setTimestamps(newTimestamps);
        setChartSeries(newChartSeries);
      } catch (error) {
        console.error("Error fetching sensor data:", error);
      }
    };
    if (selectedDevice) {
      fetchSensorData();
    }
  }, [selectedDevice]);

  // Redux selectors
  const totalNode = useSelector(
    (state: RootState) => state.app.socket.totalNode
  );
  const averageSensor = useSelector(
    (state: RootState) => state.app.socket.averageSensor
  );
  const activeNode = useSelector(
    (state: RootState) => state.app.socket.activeNode
  );

  const dangerNode = useSelector(
    (state: RootState) => state.app.socket.dangerNode
  );

  console.log(dangerNode, "check danger Node");
  // Setup socket listeners on component mount
  useEffect(() => {
    const cleanupSocketListeners = setupSocketListeners(dispatch);
    return cleanupSocketListeners; // Cleanup on unmount
  }, [dispatch]);

  return (
    <AppTheme {...props}>
      <CssBaseline enableColorScheme />
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          my: 16,
          gap: 4,
        }}
      >
        <h1>Statistical</h1>
        <Grid container spacing={3}>
          {/* Active Nodes */}
          {/* <Grid item lg={3} sm={6} xs={12}>
            <Active
              diff={12}
              trend="up"
              sx={{ height: "100%" }}
              value={activeNode}
            />
          </Grid> */}

          {/* Total Nodes */}
          <Grid item lg={3} sm={6} xs={12}>
            <Total
              diff={12}
              trend="up"
              sx={{ height: "100%" }}
              value={totalNode}
            />
          </Grid>

          {/* Average Sensor */}
          <Grid item lg={3} sm={6} xs={12}>
            <AverageSensor
              diff={12}
              trend="up"
              sx={{ height: "100%" }}
              value={averageSensor}
            />
          </Grid>

          {/* Danger Node */}
          <Grid item lg={3} sm={6} xs={12}>
            <Danger
              diff={12}
              trend="up"
              sx={{ height: "100%" }}
              value={dangerNode}
            />
          </Grid>

          {/* Dashboard Sensor */}
          <Grid item lg={8} xs={12}>
            <DashboardSensor
              chartSeries={chartSeries}
              sx={{ height: "100%" }}
              deviceList={deviceLists}
              selectedDevice={selectedDevice}
              onDeviceChange={handleDeviceChange}
              timestamps={timestamps}
            />
          </Grid>
        </Grid>
      </Container>
    </AppTheme>
  );
};
