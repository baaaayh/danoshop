import { createSlice } from '@reduxjs/toolkit';

const orderListData = createSlice({
    name: 'cart',
    initialState: {
        orderList: [],
    },
    reducers: {
        saveOrder: (state, action) => {
            console.log(action.payload);
        },
        clearOrder: (state, action) => {},
    },
});

export const { saveOrder, clearOrder } = orderListData.actions;
export default orderListData.reducer;
