import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { addMenuItem } from './modules/menuList';
import { removeToken } from './modules/userData';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './pages/main/Main';
import Product from './pages/product/Product';
import View from './pages/product/View';
import Cart from './pages/order/Cart';
import Order from './pages/order/Order';
import Login from './pages/member/Login';
import './styles/index.scss';

function App() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.user.state);
    const token = useSelector((state) => state.user.token);

    const { data, error, isLoading } = useQuery({
        queryKey: ['menu'],
        queryFn: async () => {
            const response = await axios.get('http://localhost:4000/api/menu');
            return response.data;
        },
    });

    useEffect(() => {
        !isLoading && dispatch(addMenuItem(data));
    }, [data, error, isLoading]);

    useEffect(() => {
        if (CheckValidToken(token)) {
            dispatch(removeToken());
        }
    }, [token]);

    function CheckValidToken(token) {
        if (!token) return true;
        const decoded = jwtDecode(token);
        return decoded.exp * 1000 < Date.now();
    }

    const isOrderPage = window.location.pathname === '/order/order';

    return (
        <div className="container">
            {!isOrderPage && <Header loggedIn={loggedIn} removeToken={removeToken} />}

            {!isOrderPage ? (
                <div className="wrap">
                    <Routes>
                        <Route exact path="/" element={<Main />} />
                        <Route path="/join" />
                        <Route path="/login" />
                        <Route path="/inquiry" />
                        <Route path="/recent" />
                        <Route path="/product" element={<Product />} />
                        <Route path="/product/:category" element={<Product />} />
                        <Route path="/product/:category/:type" element={<Product />} />
                        <Route path="/product/detail/:category/:id" element={<View />} />
                        <Route path="/product/detail/:category/:type/:id" element={<View />} />
                        <Route path="/order/cart" element={<Cart />} />
                        <Route path="/order/order" element={<Order />} />
                        <Route path="/member/login" element={<Login />} />
                    </Routes>
                </div>
            ) : (
                <Order />
            )}

            {!isOrderPage && <Footer />}

            <div className="dim"></div>
        </div>
    );
}

export default App;
