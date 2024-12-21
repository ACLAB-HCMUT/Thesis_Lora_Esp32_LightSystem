// config/socketHandle.ts
import { socket } from "./socketConfig";
import {
  setRows,
  setTotalNode,
  setAverageSensor,
  setActiveNode,
} from "../redux/slice/app/socketSlice";
import { Dispatch } from "redux";
import { configAxios } from "./axios";

interface RowData {
  device_id: string;
  status: string;
  sensor: string;
  timestamp: string;
}

const createData = (
  device_id: string,
  status: string,
  sensor: string,
  timestamp: string
): RowData => {
  return { device_id, status, sensor, timestamp };
};

export const setupSocketListeners = (dispatch: Dispatch) => {
  const calculateAverageSensor = (rows: RowData[]): number => {
    const total = rows.reduce((sum, row) => {
      const sensorValue = parseFloat(row.sensor);
      return isNaN(sensorValue) ? sum : sum + sensorValue;
    }, 0);

    const average = rows.length > 0 ? total / rows.length : 0;
    return parseFloat(average.toFixed(2));
  };

  const handleDataInput = (data: any): RowData[] => {
    if (Array.isArray(data)) {
      return data.map((item: any) =>
        createData(
          item.device_id?.toString() || "",
          item.status?.toString() || "",
          item.sensor?.toString() || "",
          item.timestamp?.toString() || ""
        )
      );
    } else if (typeof data === "object" && data !== null) {
      return [
        createData(
          data.device_id?.toString() || "",
          data.status?.toString() || "",
          data.sensor?.toString() || "",
          data.timestamp?.toString() || ""
        ),
      ];
    } else {
      console.error("Data format is not valid:", data);
      return [];
    }
  };

  socket.on("message", async (data) => {
    if (data.message) {
      try {
        // Parse the message if it's a string
        const parsedMessage =
          typeof data.message === "string"
            ? JSON.parse(data.message)
            : data.message;

        // Handle the parsed message data
        const parsedRows = handleDataInput(parsedMessage);
        console.log(parsedRows, "checking system");

        if (parsedRows.length > 0) {
          let activeNode = 0;
          let array1: number[] = [];

          // Populate the messageNode array with parsed device ids
          parsedRows.forEach((row) => {
            array1.push(parseInt(row.device_id));
          });

          // Fetch device list from API
          const response = await configAxios.get("device/device_list");
          const inputParam = {
            array1,
            array2: response.data,
          };

          // Compare device IDs via POST request
          // const compare = await configAxios.post(
          //   "device/compare_deviceID",
          //   inputParam
          // );
          // console.log(compare.data, "check compare");
          dispatch(setActiveNode(parsedRows.length));
          dispatch(setRows(parsedRows));
          console.log("teo");

          const averageSensor = calculateAverageSensor(parsedRows);
          dispatch(setAverageSensor(averageSensor));
        } else {
          console.error("Parsed rows are empty");
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
