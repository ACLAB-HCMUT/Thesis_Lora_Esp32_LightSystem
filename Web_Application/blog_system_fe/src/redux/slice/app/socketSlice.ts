// redux/slices/socketSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RowData {
  device_id: string;
  status: string;
  sensor: string;
  timestamp: string;
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
  },
});

export const {
  setRows,
  setTotalNode,
  setAverageSensor,
  setActiveNode,
  setDangerNode,
} = socketSlice.actions;
export default socketSlice.reducer;
