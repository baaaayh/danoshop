import { Link } from "react-router-dom";
import "./Header.scss";

function Header() {
    return (
        <header className="header">
            <div className="header__inner">
                <div className="header__nav">
                    <ul className="menu-nav">
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
                <div className="header__menu">
                    <div className="header__top">
                        <h1 className="header__logo">
                            <Link to="/">
                                <img src="images/common/logo.png" alt="" />
                            </Link>
                        </h1>
                        <div className="user">
                            <ul>
                                <li>
                                    <Link to="" className="btn-user">
                                        마이페이지
                                    </Link>
                                </li>
                                <li>
                                    <Link to="" className="btn-cart">
                                        장바구니
                                    </Link>
                                </li>
                                <li>
                                    <button
                                        type="button"
                                        className="btn-search"
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
                                <li>
                                    <Link
                                        to="/product"
                                        state={{ productType: "all" }}
                                    >
                                        전 상품
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/project">🔥습관성형 클럽🔥</Link>
                                </li>
                                <li>
                                    <Link to="/product">입맛 성형</Link>
                                    <div className="depth2">
                                        <ul>
                                            <li>
                                                <Link to="">간편식</Link>
                                            </li>
                                            <li>
                                                <Link to="">베이커리</Link>
                                            </li>
                                            <li>
                                                <Link to="">시리얼</Link>
                                            </li>
                                            <li>
                                                <Link to="">
                                                    디저트&amp;분식
                                                </Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                                <li>
                                    <Link to="/product">운동습관 성형</Link>
                                </li>
                                <li>
                                    <Link to="/project">멤버십 헤택</Link>
                                </li>
                                <li>
                                    <Link to="/product">브랜드 전용관</Link>
                                    <div className="depth2">
                                        <ul>
                                            <li>
                                                <Link to="">
                                                    디벨라, 칸나멜라,
                                                    에드몬드팔롯, 셀렉티아
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to="">알가팜텍</Link>
                                            </li>
                                            <li>
                                                <Link to="">에그마켓</Link>
                                            </li>
                                            <li>
                                                <Link to="">스키니피그</Link>
                                            </li>
                                            <li>
                                                <Link to="">쇼크업쇼버</Link>
                                            </li>
                                            <li>
                                                <Link to="">클래씨</Link>
                                            </li>
                                            <li>
                                                <Link to="">데일리유즈</Link>
                                            </li>
                                        </ul>
                                    </div>
                                </li>
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
