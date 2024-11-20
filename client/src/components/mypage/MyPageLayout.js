import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart } from "../../modules/cartList";
import { removeToken } from "../../modules/userData";

function MyPageLayout({ children, loggedIn }) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    function logout() {
        alert("로그아웃 되었습니다.");
        dispatch(clearCart());
        dispatch(removeToken());
        localStorage.removeItem("cartUpdated");
        navigate("/");
    }

    return (
        <div className="mypage">
            {location.pathname === "/mypage/dashboard" && (
                <div className="user-box">
                    <div className="user-box__inner">
                        <ul>
                            <li>
                                <div className="user-box__summary">
                                    <div className="user-box__thumb">
                                        <span>
                                            <img
                                                src="../images/sub/img_member_default.gif"
                                                alt=""
                                            />
                                        </span>
                                    </div>
                                    <div className="user-box__contents">
                                        <strong>안녕하세요. {} 님!</strong>
                                        <p>고객님의 회원등급은 {} 입니다.</p>
                                        <p>
                                            0원 이상 구매시 1%을 추가적립 받으실
                                            수 있습니다.
                                        </p>
                                        <p>
                                            [습관성형 주니어] 까지 남은
                                            구매금액은 60,000원 입니다. (최근
                                            1개월 동안 구매금액 : 0원)
                                        </p>
                                        <b>
                                            승급 기준에 따른 예상 금액이므로
                                            총주문 금액과 다를 수 있습니다.
                                        </b>
                                    </div>
                                </div>
                            </li>
                            <li>
                                <div className="user-box__subject">
                                    <div className="user-box__icon">
                                        <img
                                            src="../images/icons/icon_mileage.svg"
                                            alt=""
                                        />
                                    </div>
                                    <strong>{}원</strong>
                                    <p>총 적립금</p>
                                </div>
                            </li>
                            <li>
                                <div className="user-box__subject">
                                    <div className="user-box__icon">
                                        <img
                                            src="../images/icons/icon_coupon.svg"
                                            alt=""
                                        />
                                    </div>
                                    <strong>{}개</strong>
                                    <p>쿠폰</p>
                                </div>
                            </li>
                            <li>
                                <div className="user-box__subject">
                                    <div className="user-box__icon">
                                        <img
                                            src="../images/icons/icon_box.svg"
                                            alt=""
                                        />
                                    </div>
                                    <strong>
                                        {}원({}회)
                                    </strong>
                                    <p>총주문</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
            <div className="mypage__inner">
                <div className="mypage__left">
                    <nav>
                        <ul>
                            <li>
                                <strong>나의 쇼핑 정보</strong>
                                <ul>
                                    <li>
                                        <Link
                                            to="/mypage/dashboard"
                                            state={{
                                                title: ["마이쇼핑"],
                                            }}
                                        >
                                            마이쇼핑
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/mypage/orderHistory"
                                            state={{
                                                title: [
                                                    "마이쇼핑",
                                                    "주문내역 조회",
                                                ],
                                            }}
                                        >
                                            주문내역 조회
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>활동 정보</strong>
                                <ul>
                                    <li>
                                        <Link
                                            to="/mypage/recentView"
                                            state={{
                                                title: [
                                                    "마이쇼핑",
                                                    "최근 본 상품",
                                                ],
                                            }}
                                        >
                                            최근 본 상품
                                        </Link>
                                    </li>
                                    <li>
                                        <Link
                                            to="/mypage/wishList"
                                            state={{
                                                title: [
                                                    "마이쇼핑",
                                                    "나의 관심 상품",
                                                ],
                                            }}
                                        >
                                            나의 관심 상품
                                        </Link>
                                    </li>
                                </ul>
                            </li>
                            <li>
                                <strong>나의 정보</strong>
                                <ul>
                                    <li>
                                        <Link
                                            to="/member/validation"
                                            state={{
                                                title: ["비밀번호 입력"],
                                            }}
                                        >
                                            회원정보 수정
                                        </Link>
                                    </li>
                                    <li>
                                        <button type="button" onClick={logout}>
                                            로그아웃
                                        </button>
                                    </li>
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="mypage__view">{children}</div>
            </div>
        </div>
    );
}

export default MyPageLayout;
