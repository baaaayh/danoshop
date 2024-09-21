import { configureStore } from "@reduxjs/toolkit";
import menuReducer from "../modules/menuList";

const store = configureStore({
    reducer: {
        menu: menuReducer,
    },
});

export default store;
