import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { LatLngLiteral } from "leaflet";

interface IMapSlice {
  center: LatLngLiteral;
  zoom: number;
}

const initialState: IMapSlice = {
  center: { lat: 60.51, lng: 71.04 },
  zoom: 6,
};
const mapSlice = createSlice({
  name: "map",
  initialState,
  reducers: {
    setMapSlice(_, { payload }: PayloadAction<IMapSlice>) {
      const { center, zoom } = payload;
      return { center, zoom };
    },
  },
});

export const { setMapSlice } = mapSlice.actions;
export default mapSlice.reducer;
