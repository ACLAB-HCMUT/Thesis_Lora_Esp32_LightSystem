// config/socketHandle.ts
import { socket } from "./socketConfig";
import {
  setRows,
  setTotalNode,
  setAverageSensor,
  setActiveNode,
  setDangerNode,
} from "../redux/slice/app/socketSlice";
import { Dispatch } from "redux";
import { configAxios } from "./axios";

interface RowData {
  device_id: string;
  status: string;
  sensor: string;
  timestamp: string;
}

export const setupSocketListeners = (dispatch: Dispatch) => {
  const calculateAverageSensor = (rows: RowData[]): number => {
    const total = rows.reduce((sum, row) => {
      const sensorValue = parseFloat(row.sensor);
      return isNaN(sensorValue) ? sum : sum + sensorValue;
    }, 0);

    const average = rows.length > 0 ? total / rows.length : 0;
    return parseFloat(average.toFixed(2));
  };

  socket.on("message", async (data) => {
    if (data.message) {
      try {
        console.log("check dataing", data.message);
        // Parse the message if it's a string
        if (data.message.message == "Process completed") {
          const result = await configAxios.get("device/get_all_database");
          console.log(result);
          console.log(result.data, "check result data");
          dispatch(setRows(result.data));
          dispatch(setTotalNode(result.data.length));
          dispatch(setDangerNode(data.message.untrackedDevices));
          const average_sensor = await configAxios.get("device/get_average");
          dispatch(setAverageSensor(parseInt(average_sensor.data)));
          console.log("check point");
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    } else {
      console.error("Received data format is incorrect:", data);
    }
  });

  return () => {
    socket.off("message");
  };
};
