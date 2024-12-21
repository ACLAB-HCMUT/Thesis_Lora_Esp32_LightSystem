import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface SignState {
  email: string;
  firstName: string;
  lastName: string;
  imageURL: string;
  fullName: string;
  isSignedIn: boolean;
  id: string;
  accessToken: string;
}

const initialState: SignState = {
  email: "",
  firstName: "",
  lastName: "",
  imageURL: "",
  fullName: "",
  isSignedIn: false,
  id: "",
  accessToken: "",
};

export const signinSlice = createSlice({
  name: "signin",
  initialState,
  reducers: {
    getprofile: (state, action: PayloadAction<SignState>) => {
      state.email = action.payload.email;
      state.imageURL = action.payload.imageURL;
      state.lastName = action.payload.lastName;
      state.firstName = action.payload.firstName;
      state.fullName = action.payload.fullName;
      state.id = action.payload.id;
      state.isSignedIn = true;
    },
    logout: (state) => {
      state.email = "";
      state.firstName = "";
      state.lastName = "";
      state.imageURL = "";
      state.fullName = "";
      state.id = "";
      state.isSignedIn = false;
      state.accessToken = "";
    },
    resave: (state, action: PayloadAction<SignState>) => {
      state.email = action.payload.email;
      state.imageURL = action.payload.imageURL;
      state.lastName = action.payload.lastName;
      state.firstName = action.payload.firstName;
      state.fullName = action.payload.fullName;
    },
    saveToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { getprofile, logout, resave, saveToken } = signinSlice.actions;

export default signinSlice.reducer;
