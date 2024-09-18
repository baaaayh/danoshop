import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Main from "./pages/main/Main";
import Product from "./pages/product/Product";
import "./styles/index.scss";

function App() {
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
                </Routes>
            </div>
            <Footer />
            <div className="dim"></div>
        </div>
    );
}

export default App;
