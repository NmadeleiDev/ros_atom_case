import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IData } from "pages/api/data";

interface IDisplaySlice {
  data: IData[];
}

const initialState: IDisplaySlice = {
  data: [],
};
const displaySlice = createSlice({
  name: "display",
  initialState,
  reducers: {
    addItems(state, { payload }: PayloadAction<IData[]>) {
      state.data.concat(payload);
    },
    removeItems(state, { payload }: PayloadAction<IData[]>) {
      const idsToRemove = payload.map((el) => el.id);
      state.data.filter(({ id }) => !idsToRemove.includes(id));
    },
    removeAll() {
      return initialState;
    },
    filter,
  },
});

export const { addItems } = displaySlice.actions;
export default displaySlice.reducer;
