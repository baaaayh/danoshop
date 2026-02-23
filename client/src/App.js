import { createContext, useState, useEffect, useRef, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";
import { addMenuItem } from "./modules/menuList";
import { removeToken } from "./modules/userData";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Main from "./pages/main/Main";
import Product from "./pages/product/Product";
import View from "./pages/product/View";
import Cart from "./pages/order/Cart";
import Order from "./pages/order/Order";
import OrderResult from "./pages/order/OrderResult";
import Login from "./pages/member/Login";
import Agreement from "./pages/member/Agreement";
import Join from "./pages/member/Join";
import JoinResult from "./pages/member/JoinResult";
import Validation from "./pages/member/Validation";
import Modify from "./pages/member/Modify";
import FindPass from "./pages/member/FindPass";
import MyPage from "./pages/mypage/MyPage";
import "./styles/index.scss";
import SideOrder from "./components/layout/SideOrder";
import Membership from "./pages/events/Membership";
import SearchResult from "./pages/search/SearchResult";
import SearchForm from "./components/layout/SearchForm";
import { showDim, hiddenDim } from "./modules/dimToggle";
export const SidePanelContext = createContext(null);

function App() {
  const dispatch = useDispatch();
  const loggedIn = useSelector((state) => state.user.state);
  const token = useSelector((state) => state.user.token);
  const location = useLocation();
  const { pathname } = location;
  const [previousPath, setPreviousPath] = useState("");
  const [searchFormVisible, setSearchFormVisible] = useState(false);

  useEffect(() => {
    setPreviousPath(location.pathname);
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const sidePanel = useRef();

  const { data, error, isLoading } = useQuery({
    queryKey: ["menu"],
    queryFn: async () => {
      const response = await axios.get("/api/menu");
      return response.data;
    },
  });

  useEffect(() => {
    !isLoading && dispatch(addMenuItem(data));
  }, [data, error, isLoading, dispatch]);

  const checkValidToken = useCallback((token) => {
    if (!token) return true;
    const decoded = jwtDecode(token);
    return decoded.exp * 1000 < Date.now();
  }, []);

  useEffect(() => {
    if (checkValidToken(token)) {
      dispatch(removeToken());
    }
  }, [checkValidToken, dispatch, token]);

  const isOrderPage = location.pathname === "/order/order";
  const isResultPage = location.pathname === "/order/orderResult";

  const mobileMenu = useRef(null);

  const openSearchFunc = useCallback(() => {
    dispatch(showDim());
    setSearchFormVisible(true);
    document.body.style.overflow = "hidden";
  }, [dispatch]);

  const closeSearchFunc = useCallback(() => {
    dispatch(hiddenDim());
    setSearchFormVisible(false);
    document.body.style.overflow = "";
  }, [dispatch]);

  const [headerState, setHeaderState] = useState(false);

  return (
    <>
      <SidePanelContext.Provider value={sidePanel}>
        <div className="container">
          {!isOrderPage && !isResultPage && (
            <>
              <Header
                loggedIn={loggedIn}
                removeToken={removeToken}
                mobileMenu={mobileMenu}
                openSearchFunc={openSearchFunc}
                closeSearchFunc={closeSearchFunc}
                setHeaderState={setHeaderState}
              />
              {searchFormVisible && (
                <SearchForm
                  closeSearchFunc={closeSearchFunc}
                  headerState={headerState}
                  loggedIn={loggedIn}
                />
              )}
            </>
          )}
          {isOrderPage ? (
            <Order previousPath={previousPath} />
          ) : isResultPage ? (
            <OrderResult />
          ) : (
            <>
              <div className="wrap">
                <Routes>
                  <Route exact path="/" element={<Main />} />
                  <Route path="/product" element={<Product />} />
                  <Route path="/product/:category" element={<Product />} />
                  <Route
                    path="/product/:category/:type"
                    element={<Product />}
                  />
                  <Route path="/events/membership" element={<Membership />} />
                  <Route
                    path="/product/detail/:category/:id"
                    element={<View />}
                  />
                  <Route
                    path="/product/detail/:category/:type/:id"
                    element={<View />}
                  />
                  <Route path="/order/cart" element={<Cart />} />
                  <Route path="/member/agreement" element={<Agreement />} />
                  <Route path="/member/join" element={<Join />} />
                  <Route path="/member/result" element={<JoinResult />} />
                  <Route path="/member/login" element={<Login />} />
                  <Route path="/member/validation" element={<Validation />} />
                  <Route path="/member/modify" element={<Modify />} />
                  <Route path="/member/findPass" element={<FindPass />} />
                  <Route path="/mypage/*" element={<MyPage />} />
                  <Route
                    path="/search/searchResult"
                    element={<SearchResult />}
                  />
                </Routes>
              </div>
            </>
          )}
          {!isOrderPage && !isResultPage && (
            <Footer
              mobileMenu={mobileMenu}
              openSearchFunc={openSearchFunc}
              loggedIn={loggedIn}
            />
          )}
        </div>
        <SideOrder ref={sidePanel} />
      </SidePanelContext.Provider>
    </>
  );
}

export default App;
