import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import styles from "./Header.module.scss";

function Header() {
    const [menuList, setMenuList] = useState({ menu: [] });
    const menuListData = useSelector((state) => state.menu.menuList);
    const [scrolled, setScrolled] = useState();

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
                            <Link to="/join">회원가입</Link>
                        </li>
                        <li>
                            <Link to="/login">로그인</Link>
                        </li>
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
                                    >
                                        장바구니
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
