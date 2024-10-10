// store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import menuReducer from "../modules/menuList";
import cartReducer from "../modules/cartList";
import userReducer from "../modules/userData";

const persistConfig = {
    cart: {
        key: "cart",
        storage,
    },
    user: {
        key: "user",
        storage,
    },
};

const rootReducer = combineReducers({
    menu: menuReducer,
    cart: persistReducer(persistConfig.cart, cartReducer),
    user: persistReducer(persistConfig.user, userReducer),
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
