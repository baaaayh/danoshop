import { createSlice } from "@reduxjs/toolkit";

const userData = createSlice({
    name: "user",
    initialState: {
        state: "guest",
        userId: null,
        token: null,
    },
    reducers: {
        saveToken: (state, action) => {
            state.state = "member";
            state.token = action.payload.token;
            state.userId = action.payload.userId;
        },
        removeToken: (state, action) => {
            state.state = "guest";
            state.userId = null;
            state.token = null;
        },
    },
});

export const { saveToken, removeToken } = userData.actions;
export default userData.reducer;
