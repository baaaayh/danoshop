// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import sessionStorage from "redux-persist/lib/storage/session"; // 세션 스토리지를 임포트
import { combineReducers } from "redux";
import menuReducer from "../modules/menuList";
import cartReducer from "../modules/cartList";
import userReducer from "../modules/userData";
import orderList from "../modules/orderList";
import sideOrderReducer from "../modules/sideOrder";

const persistConfig = {
    cart: {
        key: "cart",
        storage: sessionStorage,
    },
    user: {
        key: "user",
        storage: sessionStorage,
    },
    order: {
        key: "order",
        storage: sessionStorage,
    },
};

const rootReducer = combineReducers({
    menu: menuReducer,
    cart: persistReducer(persistConfig.cart, cartReducer),
    user: persistReducer(persistConfig.user, userReducer),
    order: persistReducer(persistConfig.order, orderList),
    sideOrder: sideOrderReducer,
});

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ["persist/PERSIST"],
            },
        }),
});

export const persistor = persistStore(store);
export default store;
