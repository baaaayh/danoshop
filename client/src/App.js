import { Routes, Route } from "react-router-dom";
import Main from "./pages/main/Main";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./styles/index.scss";

function App() {
    return (
        <div className="container">
            <Header />
            <div className="wrap">
                <Routes>
                    <Route exact path="/" element={<Main />} />
                    <Route exact path="/join" />
                    <Route exact path="/login" />
                    <Route exact path="/inquiry" />
                    <Route exact path="/recent" />
                </Routes>
            </div>
            <Footer />
            <div className="dim"></div>
        </div>
    );
}

export default App;
