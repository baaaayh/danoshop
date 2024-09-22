import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/main/Main";
import Product from "./pages/product/Product";
import View from "./pages/product/View";
import Cart from "./pages/order/Cart";

import "./styles/index.scss";

import { useDispatch } from "react-redux";
import { addMenuItem } from "./modules/menuList";

function App() {
    const dispatch = useDispatch();

    const handleAddMenuItem = (data) => {
        dispatch(addMenuItem(data));
    };

    const getMenuList = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/menu");
            handleAddMenuItem(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    useEffect(() => {
        getMenuList();
    }, []);

    return (
        <div className="container">
            <Header />
            <div className="wrap">
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route path="/join" />
                    <Route path="/login" />
                    <Route path="/inquiry" />
                    <Route path="/recent" />
                    <Route path="/product" element={<Product />} />
                    <Route path="/product/:category" element={<Product />} />
                    <Route
                        path="/product/:category/:type"
                        element={<Product />}
                    />
                    <Route
                        path="/product/detail/:category/:id"
                        element={<View />}
                    />
                    <Route
                        path="/product/detail/:category/:type/:id"
                        element={<View />}
                    />
                    <Route path="/order/cart" element={<Cart />} />
                </Routes>
            </div>
            <Footer />
            <div className="dim"></div>
        </div>
    );
}

export default App;
