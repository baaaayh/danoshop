import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, clearCart } from "../modules/cartList";
import axios from "axios";
import styles from "./Header.module.scss";

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

    useEffect(() => {
        const cartUpdated = localStorage.getItem("cartUpdated");
        if (userInfo.token && !cartUpdated) {
            fetchCartData().then(() => {
                localStorage.setItem("cartUpdated", "true"); // 데이터가 가져와지면 localStorage에 저장
            });
        }
    }, [userInfo.token]);

    async function fetchCartData() {
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
    }

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

    return (
        <header
            className={
                scrolled ? `${styles.header} ${styles.active}` : styles.header
            }
        >
            <div className={styles.header__inner}>
                <div className={styles.header__nav}>
                    <ul className={styles["menu-nav"]}>
                        <li>
                            <Link to="/member/agreement">회원가입</Link>
                        </li>
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
                            <Link to="/inquiry">주문조회</Link>
                        </li>
                        <li>
                            <Link to="/recent">최근본상품</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.header__menu}>
                    <div className={styles.header__top}>
                        <h1 className={styles.header__logo}>
                            <Link to="/">
                                <img src="/images/common/logo.png" alt="" />
                            </Link>
                        </h1>
                        <div className={styles.user}>
                            <ul>
                                <li>
                                    <Link to="" className={styles["btn-user"]}>
                                        마이페이지
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/order/cart"
                                        className={styles["btn-cart"]}
                                        state={{ title: ["장바구니"] }}
                                    >
                                        장바구니
                                        <span>{totalQuantity}</span>
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className={styles["btn-search"]}
                                    >
                                        검색
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className={styles.header__bottom}>
                        <nav className={styles.gnb}>
                            <ul>
                                {menuList &&
                                    menuList.menu.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                to={`/${item.pageType}/${item.category}`}
                                                state={{
                                                    title: [item.depth1],
                                                }}
                                            >
                                                {item.depth1}
                                            </Link>
                                            {item.depth2.length > 0 && (
                                                <div className={styles.depth2}>
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
        </header>
    );
}

export default Header;
