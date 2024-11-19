import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    dimVisible: false,
};

const dimVisible = createSlice({
    name: "header",
    initialState,
    reducers: {
        showDim: (state) => {
            state.dimVisible = true;
        },
        hiddenDim: (state) => {
            state.dimVisible = false;
        },
        toggleDim: (state) => {
            state.dimVisible = !state.dimVisible;
        },
    },
});

export const { showDim, hiddenDim, toggleDim } = dimVisible.actions;
export default dimVisible.reducer;
