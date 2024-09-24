import { createSlice } from '@reduxjs/toolkit';

const userData = createSlice({
    name: 'user',
    initialState: {
        state: 'guest',
        token: null,
    },
    reducers: {
        saveToken: (state, action) => {
            state.state = 'member';
            state.token = action.payload.token;
        },
        removeToken: (state, action) => {
            state.state = 'guest';
            state.token = null;
        },
    },
});

export const { saveToken, removeToken } = userData.actions;
export default userData.reducer;
