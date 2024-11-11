import { createSlice } from "@reduxjs/toolkit";

const sideOrderData = createSlice({
    name: "sideOrder",
    initialState: {
        sideOrderItem: {},
    },
    reducers: {
        setSideOrder: (state, action) => {
            state.sideOrderItem = action.payload;
        },
    },
});

export const { setSideOrder } = sideOrderData.actions;
export default sideOrderData.reducer;
