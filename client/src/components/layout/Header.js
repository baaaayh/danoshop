import { useEffect, useState, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, clearCart } from "../../modules/cartList";
import { showDim, hiddenDim } from "../../modules/dimToggle";

import axios from "axios";

function Header({ loggedIn, removeToken }) {
    const navigate = useNavigate();
    const [totalQuantity, setTotalQuantity] = useState(0);
    const [menuList, setMenuList] = useState({ menu: [] });
    const [scrolled, setScrolled] = useState();
    const dispatch = useDispatch();
    const menuListData = useSelector((state) => state.menu.menuList);
    const itemsOptions = useSelector((state) =>
        state.cart.cartList?.map((item) => item.options)
    );
    const userInfo = useSelector((state) => state.user);
    const localCart = useSelector((state) => state.cart.cartList);
    const [searchText, setSearchText] = useState("");

    const fetchCartData = useCallback(async () => {
        try {
            if (localStorage.getItem("cartUpdated")) {
                return;
            }

            const response = await axios.post(
                "http://localhost:4000/api/userCart",
                {
                    loginData: { id: userInfo.userId },
                    localCart: localCart,
                    type: "update",
                }
            );

            if (response.data.success) {
                dispatch(clearCart());
                response.data.cart.forEach((item) =>
                    dispatch(addCartItem(item))
                );
            }
        } catch (error) {
            console.error("Failed to fetch cart data:", error);
            alert(
                "장바구니 데이터를 가져오는 데 실패했습니다. 서버에 문제가 있을 수 있습니다."
            );
        }
    }, [userInfo.userId, localCart, dispatch]);

    useEffect(() => {
        const cartUpdated = localStorage.getItem("cartUpdated");
        if (userInfo.token && !cartUpdated) {
            fetchCartData().then(() => {
                localStorage.setItem("cartUpdated", "true"); // 데이터가 가져와지면 localStorage에 저장
            });
        }
    }, [fetchCartData, userInfo.token]);

    useEffect(() => {
        const total = itemsOptions.reduce((acc, options) => {
            return (
                acc +
                options.reduce((optAcc, option) => {
                    return optAcc + (option.value.quantity || 0);
                }, 0)
            );
        }, 0);

        if (total !== totalQuantity) {
            setTotalQuantity(total);
        }
    }, [itemsOptions, totalQuantity]);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 0) {
                setScrolled("active");
            } else {
                setScrolled();
            }
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    useEffect(() => {
        setMenuList(menuListData[0]);
    }, [menuListData]);

    function logout() {
        alert("로그아웃 되었습니다.");
        dispatch(clearCart());
        dispatch(removeToken());
        localStorage.removeItem("cartUpdated");
        navigate("/");
    }

    const hoverMenu = useRef([]);

    useEffect(() => {
        let ww = window.innerWidth;
        if (ww > 1024) {
            hoverMenu.current.forEach((menu) => {
                menu.addEventListener("mouseenter", (e) => {
                    dispatch(showDim());
                });
                menu.addEventListener("mouseleave", (e) => {
                    dispatch(hiddenDim());
                });
            });
        }
    }, [menuList, dispatch]);

    const searchForm = useRef();
    const openSearchForm = useRef();
    const closeSearchForm = useRef();

    useEffect(() => {
        openSearchForm.current.addEventListener("click", (e) => {
            dispatch(showDim());
            searchForm.current.classList.add("search-form--active");
        });
        closeSearchForm.current.addEventListener("click", (e) => {
            dispatch(hiddenDim());
            searchForm.current.classList.remove("search-form--active");
        });
    }, [dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        dispatch(hiddenDim());
        searchForm.current.classList.remove("search-form--active");
        navigate(
            `/search/searchResult?search=${encodeURIComponent(searchText)}`
        );
        setSearchText("");
    };

    const handleChange = (e) => {
        setSearchText(e.target.value);
    };

    return (
        <>
            <header className={scrolled ? "header active" : "header"}>
                <div className="header__inner">
                    <div className="header__nav">
                        <ul className="menu-nav">
                            {loggedIn === "guest" ? (
                                <li>
                                    <Link
                                        to="/member/agreement"
                                        state={{ title: ["회원가입"] }}
                                    >
                                        회원가입
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <Link
                                        to="/member/validation"
                                        state={{ title: ["비밀번호 입력"] }}
                                    >
                                        내정보수정
                                    </Link>
                                </li>
                            )}
                            {loggedIn === "guest" ? (
                                <li>
                                    <Link
                                        to="/member/login"
                                        state={{ title: ["로그인"] }}
                                    >
                                        로그인
                                    </Link>
                                </li>
                            ) : (
                                <li>
                                    <button type="button" onClick={logout}>
                                        로그아웃
                                    </button>
                                </li>
                            )}
                            <li>
                                <Link
                                    to="/mypage/orderHistory"
                                    state={{
                                        title: ["마이쇼핑", "주문조회"],
                                    }}
                                >
                                    주문조회
                                </Link>
                            </li>
                            {loggedIn === "member" && (
                                <li>
                                    <Link
                                        to="/mypage/dashboard"
                                        state={{ title: ["마이쇼핑"] }}
                                    >
                                        마이페이지
                                    </Link>
                                </li>
                            )}
                            <li>
                                <Link to="/mypage/recentView">최근본상품</Link>
                            </li>
                        </ul>
                    </div>
                    <div className="header__menu">
                        <div className="header__top">
                            <button type="button" className="btn btn-mobmenu">
                                <span>모바일 메뉴</span>
                            </button>
                            <h1 className="header__logo">
                                <Link to="/">
                                    <img src="/images/common/logo.png" alt="" />
                                </Link>
                            </h1>
                            <div className="user">
                                <ul>
                                    <li>
                                        <Link
                                            to={
                                                loggedIn === "guest"
                                                    ? "member/login"
                                                    : "/mypage/dashboard"
                                            }
                                            className="btn btn-user"
                                            state={
                                                loggedIn === "guest"
                                                    ? { title: ["로그인"] }
                                                    : { title: ["마이쇼핑"] }
                                            }
                                        >
                                            마이페이지
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/order/cart"
                                            className="btn btn-cart"
                                            state={{ title: ["장바구니"] }}
                                        >
                                            장바구니
                                            <span>{totalQuantity}</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="btn btn-search"
                                            ref={openSearchForm}
                                        >
                                            검색
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="header__bottom">
                            <nav className="gnb">
                                <ul>
                                    {menuList &&
                                        menuList.menu.map((item, index) => (
                                            <li
                                                key={index}
                                                ref={(el) =>
                                                    (hoverMenu.current[index] =
                                                        el)
                                                }
                                            >
                                                <Link
                                                    to={`/${item.pageType}/${item.category}`}
                                                    state={{
                                                        title: [item.depth1],
                                                    }}
                                                >
                                                    {item.depth1}
                                                </Link>
                                                {item.depth2.length > 0 && (
                                                    <div className="depth2">
                                                        <ul>
                                                            {item.depth2.map(
                                                                (dep2) => (
                                                                    <li
                                                                        key={
                                                                            dep2.name
                                                                        }
                                                                    >
                                                                        <Link
                                                                            to={`/${item.pageType}/${item.category}/${dep2.type}`}
                                                                            state={{
                                                                                title: [
                                                                                    item.depth1,
                                                                                    dep2.name,
                                                                                ],
                                                                            }}
                                                                        >
                                                                            {
                                                                                dep2.name
                                                                            }
                                                                        </Link>
                                                                    </li>
                                                                )
                                                            )}
                                                        </ul>
                                                    </div>
                                                )}
                                            </li>
                                        ))}
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className="search-form " ref={searchForm}>
                    <div className="search-form__inner">
                        <h2>SEARCH</h2>
                        <div className="search-form__box">
                            <div className="search-form__input">
                                <input
                                    type="text"
                                    placeholder="검색어를 입력해 주세요."
                                    value={searchText}
                                    onChange={handleChange}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-search"
                                    onClick={onSubmit}
                                >
                                    검색
                                </button>
                            </div>
                            <button
                                type="button"
                                className="btn btn-close"
                                ref={closeSearchForm}
                            >
                                <span>닫기</span>
                            </button>
                        </div>
                    </div>
                </div>
            </header>
            <aside className="mob-menu">
                <div className="mob-menu__inner">
                    <div className="mob-menu__top">
                        <ul>
                            <li>
                                <Link to="">회원가입</Link>
                            </li>
                            <li>
                                <Link to="">로그인</Link>
                            </li>
                            <li>
                                <Link to="">주문조회</Link>
                            </li>
                            <li>
                                <Link to="">최근본상품</Link>
                            </li>
                        </ul>
                    </div>
                    <nav className="mob-menu__gnb">
                        <ul>
                            <li></li>
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}

export default Header;
