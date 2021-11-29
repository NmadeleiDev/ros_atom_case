import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChangeEventValue } from "google-map-react";

interface IMapSlice extends Omit<ChangeEventValue, "size" | "marginBounds"> {}

const initialState: IMapSlice = {
  center: { lat: 55.75, lng: 37.6 },
  zoom: 10,
  bounds: {
    ne: { lat: 55.836641335088075, lng: 38.20517050714105 },
    nw: { lat: 55.836641335088075, lng: 36.90329062432855 },
    se: { lat: 55.33760527983421, lng: 38.20517050714105 },
    sw: { lat: 55.33760527983421, lng: 36.90329062432855 },
  },
};
const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapSlice(_, { payload }: PayloadAction<ChangeEventValue>) {
      const { center, zoom, bounds } = payload;
      return { center, zoom, bounds };
    },
  },
});

export const { setMapSlice } = mapSlice.actions;
export default mapSlice.reducer;
