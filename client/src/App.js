import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/main/Main";
import Product from "./pages/product/Product";
import "./styles/index.scss";

function App() {
    const [menuList, setMenuList] = useState({ menu: [] });
    const [productList, setProductList] = useState([]);

    const getProductList = async () => {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product"
            );
            setProductList(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    const getMenuList = async () => {
        try {
            const response = await axios.get("http://localhost:4000/api/menu");
            setMenuList(response.data);
        } catch (error) {
            console.error("Error fetching product list:", error);
        }
    };

    useEffect(() => {
        getProductList();
        getMenuList();
    }, []);

    return (
        <div className="container">
            <Header menu={menuList} />
            <div className="wrap">
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route path="/join" />
                    <Route path="/login" />
                    <Route path="/inquiry" />
                    <Route path="/recent" />
                    <Route
                        path="/product"
                        element={
                            <Product product={productList} menu={menuList} />
                        }
                    />
                    <Route
                        path="/product/:category"
                        element={
                            <Product product={productList} menu={menuList} />
                        }
                    />
                    <Route
                        path="/product/:category/:type"
                        element={
                            <Product product={productList} menu={menuList} />
                        }
                    />
                </Routes>
            </div>
            <Footer />
            <div className="dim"></div>
        </div>
    );
}

export default App;
