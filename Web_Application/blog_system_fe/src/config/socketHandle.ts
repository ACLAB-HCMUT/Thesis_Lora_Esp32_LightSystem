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

export const setupSocketListeners = (dispatch: Dispatch) => {
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
        }
      } catch (error) {
        console.error("Error parsing message:", error);
      }
    } else {
      console.error("Received data format is incorrect:", data);
    }
  });

  return () => {
    console.log("Socket listener cleaned up");
    socket.off("message");
  };
};
