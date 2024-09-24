import { createSlice } from '@reduxjs/toolkit';

const menuListData = createSlice({
    name: 'menu',
    initialState: {
        menuList: [],
    },
    reducers: {
        addMenuItem: (state, action) => {
            state.menuList.push(action.payload);
        },
    },
});

export const { addMenuItem } = menuListData.actions;
export default menuListData.reducer;
