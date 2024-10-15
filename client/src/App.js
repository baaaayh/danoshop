import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { jwtDecode } from 'jwt-decode';
import { addMenuItem } from './modules/menuList';
import { removeToken } from './modules/userData';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Main from './pages/main/Main';
import Product from './pages/product/Product';
import View from './pages/product/View';
import Cart from './pages/order/Cart';
import Order from './pages/order/Order';
import Login from './pages/member/Login';
import Agreement from './pages/member/Agreement';
import Join from './pages/member/Join';
import JoinResult from './pages/member/JoinResult';
import Validation from './pages/member/Validation';
import Modify from './pages/member/Modify';
import FindPass from './pages/member/FindPass';
import MyPage from './pages/mypage/MyPage';
import './styles/index.scss';

function App() {
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.user.state);
    const token = useSelector((state) => state.user.token);
    const location = useLocation(); // useLocation 훅 사용

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

    const isOrderPage = location.pathname === '/order/order'; // 현재 경로 확인

    return (
        <div className="container">
            {!isOrderPage && <Header loggedIn={loggedIn} removeToken={removeToken} />}
            {isOrderPage ? (
                <Order />
            ) : (
                <div className="wrap">
                    <Routes>
                        <Route exact path="/" element={<Main />} />

                        <Route path="/product" element={<Product />} />
                        <Route path="/product/:category" element={<Product />} />
                        <Route path="/product/:category/:type" element={<Product />} />
                        <Route path="/product/detail/:category/:id" element={<View />} />
                        <Route path="/product/detail/:category/:type/:id" element={<View />} />
                        <Route path="/order/cart" element={<Cart />} />
                        <Route path="/member/agreement" element={<Agreement />} />
                        <Route path="/member/join" element={<Join />} />
                        <Route path="/member/result" element={<JoinResult />} />
                        <Route path="/member/login" element={<Login />} />
                        <Route path="/member/validation" element={<Validation />} />
                        <Route path="/member/modify" element={<Modify />} />
                        <Route path="/member/findPass" element={<FindPass />} />
                        <Route path="/mypage/*" element={<MyPage />} />
                    </Routes>
                </div>
            )}
            {!isOrderPage && <Footer />}
            <div className="dim"></div>
        </div>
    );
}

export default App;
