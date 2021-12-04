import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import {
  isAfter,
  parse,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns";

export interface IData {
  id: number;
  shoot_ts: string;
  lat: number;
  lng: number;
  npy_img_bytes: string;
  class_id: string;
  polution_type: string;
  area_meters: number;
  level_of_pol: number;
  company: string;
  license_area: string;
  poluted_area_reg_n: string;
  location_of_poluted_area: string;
  adm_region: string;
  last_spill_date: string;
  region_category: string;
  location_name: string;
  have_special_zones: string;
}

interface IDataSlice {
  data: IData[];
  display: IData[];
  ascSort: boolean;
}

interface IFilter {
  key: "day" | "week" | "month" | "year";
  value: number;
}

const initialState: IDataSlice = {
  data: [],
  display: [],
  ascSort: true,
};
const dataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    addItems(state, { payload }: PayloadAction<IData[]>) {
      const existsIds = state.data.map((el) => el.id);
      console.log({ existsIds, payload });
      if (existsIds.length === 0) {
        state.data = [...payload];
      } else {
        const itemsToAdd = payload.filter((el) => !existsIds.includes(el.id));
        state.data.concat(itemsToAdd);
      }
    },
    removeItems(state, { payload }: PayloadAction<IData[]>) {
      const idsToRemove = payload.map((el) => el.id);
      state.data.filter(({ id }) => !idsToRemove.includes(id));
    },
    removeAll() {
      return initialState;
    },

    showItems(state, { payload }: PayloadAction<IData[]>) {
      addItems(payload);
      const existsIds = state.display.map((el) => el.id);
      const itemsToAdd = payload.filter((el) => !existsIds.includes(el.id));
      state.display.concat(itemsToAdd);
    },
    hideItems(state, { payload }: PayloadAction<IData[]>) {
      const idsToRemove = payload.map((el) => el.id);
      state.display.filter(({ id }) => !idsToRemove.includes(id));
    },
    hideAll(state) {
      state.display = [];
    },
    // sortItems(state, { payload }: PayloadAction<keyof IData>) {
    //   console.log({ payload });
    //   switch (payload) {
    //     case "id":
    //     case "factory":
    //     case "zoneName":
    //     case "materialType":
    //     case "region":
    //     case "landType":
    //       state.display.sort((a, b) =>
    //         state.ascSort
    //           ? a[payload].localeCompare(b[payload])
    //           : b[payload].localeCompare(a[payload])
    //       );
    //       break;
    //     case "square":
    //       state.display.sort((a, b) =>
    //         state.ascSort ? a[payload] - b[payload] : b[payload] - a[payload]
    //       );
    //       break;
    //     case "regDate":
    //     case "actDate":
    //     case "lastIncedentDate":
    //       state.display.sort((a, b) => {
    //         const aDate = parse(a[payload], "DD.MM.YYYY", new Date());
    //         const bDate = parse(b[payload], "DD.MM.YYYY", new Date());
    //         if (state.ascSort) return isAfter(aDate, bDate) ? 1 : -1;
    //         else return isAfter(aDate, bDate) ? -1 : 1;
    //       });
    //       break;
    //   }
    // },
    // filterItemsByDate(state, { payload }: PayloadAction<IFilter>) {
    //   if (payload.key === "day") {
    //     const limit = subDays(new Date(), 1);
    //     state.display = state.data.filter(
    //       (el) =>
    //         el.lastIncedentDate &&
    //         isAfter(parse(el.lastIncedentDate, "DD.MM.YYYY", new Date()), limit)
    //     );
    //   } else if (payload.key === "week") {
    //     const limit = subWeeks(new Date(), 1);
    //     state.display = state.data.filter(
    //       (el) =>
    //         el.lastIncedentDate &&
    //         isAfter(parse(el.lastIncedentDate, "DD.MM.YYYY", new Date()), limit)
    //     );
    //   } else if (payload.key === "month") {
    //     const limit = subMonths(new Date(), 1);
    //     state.display = state.data.filter(
    //       (el) =>
    //         el.lastIncedentDate &&
    //         isAfter(parse(el.lastIncedentDate, "DD.MM.YYYY", new Date()), limit)
    //     );
    //   } else if (payload.key === "year") {
    //     const limit = subYears(new Date(), 1);
    //     state.display = state.data.filter(
    //       (el) =>
    //         el.lastIncedentDate &&
    //         isAfter(parse(el.lastIncedentDate, "DD.MM.YYYY", new Date()), limit)
    //     );
    //   }
    // },
  },
});

export const {
  addItems,
  removeAll,
  removeItems,
  showItems,
  hideItems,
  hideAll,
  //   sortItems,
  //   filterItemsByDate,
} = dataSlice.actions;
export default dataSlice.reducer;
