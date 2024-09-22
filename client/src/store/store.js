// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import menuReducer from "../modules/menuList";
import cartReducer from "../modules/cartList";

const persistConfig = {
    key: "cart",
    storage,
};

const rootReducer = combineReducers({
    menu: menuReducer,
    cart: persistReducer(persistConfig, cartReducer), // cartReducer에만 persist 적용
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"], // 필요한 경우 다른 액션도 추가
            },
        }),
});

export const persistor = persistStore(store);
export default store;
