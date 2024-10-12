import { createSlice } from "@reduxjs/toolkit";

const orderListData = createSlice({
    name: "order",
    initialState: {
        orderList: [],
    },
    reducers: {
        saveOrder: (state, action) => {
            state.orderList = action.payload;
        },
        removeOrderOption: (state, action) => {
            state.orderList = state.orderList.filter((stateOption) => {
                return stateOption.key !== action.payload;
            });
        },
        clearOrder: (state, action) => {
            state.orderList = [];
        },
    },
});

export const { saveOrder, removeOrderOption, clearOrder } =
    orderListData.actions;
export default orderListData.reducer;
