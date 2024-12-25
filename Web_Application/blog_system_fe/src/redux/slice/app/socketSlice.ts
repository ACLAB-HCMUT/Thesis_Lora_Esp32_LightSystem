// redux/slices/socketSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RowData {
  device_id: string;
  status: boolean;
  sensor: string;
  timestamp: string;
  check: boolean;
}

interface SocketState {
  rows: RowData[];
  totalNode: number;
  averageSensor: number;
  activeNode: number;
  dangerNode: [];
}

const initialState: SocketState = {
  rows: [],
  totalNode: 0,
  averageSensor: 0,
  activeNode: 0,
  dangerNode: [],
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setRows: (state, action: PayloadAction<RowData[]>) => {
      console.log("setRows called with:", action.payload);
      state.rows = action.payload;
    },
    setTotalNode: (state, action: PayloadAction<number>) => {
      state.totalNode = action.payload;
    },
    setAverageSensor: (state, action: PayloadAction<number>) => {
      state.averageSensor = action.payload;
    },
    setActiveNode: (state, action: PayloadAction<number>) => {
      state.activeNode = action.payload;
    },
    setDangerNode: (state, action: PayloadAction<[]>) => {
      state.dangerNode = action.payload;
    },
    updateDeviceStatus: (
      state,
      action: PayloadAction<{ device_id: string; status: boolean }>
    ) => {
      const { device_id, status } = action.payload;
      const row = state.rows.find((row) => row.device_id === device_id);
      if (row) {
        row.status = status ? true : false;
      }
    },
  },
});

export const {
  setRows,
  setTotalNode,
  setAverageSensor,
  setActiveNode,
  setDangerNode,
  updateDeviceStatus,
} = socketSlice.actions;
export default socketSlice.reducer;
