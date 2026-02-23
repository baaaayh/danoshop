import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import "./styles/index.scss";
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
  </BrowserRouter>,
);
