import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./styles/index.scss";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root"));
const queryClient = new QueryClient();

root.render(
    <BrowserRouter>
        <QueryClientProvider client={queryClient}>
            <Provider store={store} stabilityCheck="never">
                <App />
            </Provider>
        </QueryClientProvider>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
