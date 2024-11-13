import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";

function OrderResult() {
    const location = useLocation();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user);
    const cartList = useSelector((state) => state.cart.cartList);
    const [optionTotalQuantity, setOptionTotalQuantity] = useState(0);
    const [orderInfo, setOrderInfo] = useState({});

    useEffect(() => {
        const totalQuantity = cartList.reduce((acc, item) => {
            return (
                acc +
                item.options.reduce((optionAcc, option) => {
                    return optionAcc + option.value.quantity;
                }, 0)
            );
        }, 0);
        setOptionTotalQuantity(totalQuantity);
    }, []);

    const orderId = location.state.orderId;

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await axios.post(
                "http://localhost:4000/api/getOrderHistory",
                {
                    userId: userInfo.userId,
                    orderId,
                }
            );

            if (response.data.success) {
                setOrderInfo(...response.data.orderObj);
            }
        };
        fetchOrderData();
    }, []);

    return (
        <div className="order order--result">
            <div className="order__inner">
                <div className="order__header">
                    <div className="order__nav">
                        <button
                            type="button"
                            onClick={() => {
                                if (userInfo.token) {
                                    navigate("/order/cart", {
                                        state: { title: ["장바구니"] },
                                    });
                                } else {
                                    navigate("/member/login", {
                                        state: {
                                            title: ["로그인"],
                                            prevPage: location.pathname,
                                        },
                                    });
                                }
                            }}
                        >
                            뒤로가기
                        </button>
                        <h2>
                            <Link to="/">다노샵</Link>
                        </h2>
                        <div className="user-area">
                            <ul>
                                <li className="user-cart">
                                    <Link to="/order/cart">
                                        장바구니
                                        <span>{optionTotalQuantity}</span>
                                    </Link>
                                </li>
                                <li className="user-mypage">
                                    <Link
                                        to="/mypage/orderHistory"
                                        state={{
                                            title: ["마이 쇼핑", "주문조회"],
                                        }}
                                    >
                                        마이페이지
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <h3>주문완료</h3>
                </div>
                <div className="order__body">
                    <div className="order__outter order__outter--zigzag">
                        <div className="order__box">
                            <div className="order__top">
                                <div className="order__figure">
                                    <img
                                        src="/images/icons/icon_bag.png"
                                        alt=""
                                    />
                                </div>
                                <strong>
                                    고객님의 주문이
                                    <br />
                                    정상적으로 완료되었습니다.
                                </strong>
                            </div>
                            <div className="order__summary">
                                <ul>
                                    <li>
                                        <span>주문번호</span>
                                        <strong>{orderId}</strong>
                                    </li>
                                    <li>
                                        <span>결제금액</span>
                                        <strong>
                                            {orderInfo?.totalPrice?.toLocaleString()}
                                            원
                                        </strong>
                                    </li>
                                </ul>
                            </div>
                            <div className="order__link">
                                <Link to="/">
                                    <img
                                        src="/images/sub/dano_banner.png"
                                        alt=""
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__title">
                            <strong>결제수단</strong>
                        </div>
                        <div className="order__content">
                            <ul>
                                <li>
                                    <span>결제수단</span>
                                    <p>{orderInfo?.selectedPayment}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__title">
                            <strong>배송지</strong>
                        </div>
                        <div className="order__content">
                            <ul>
                                <li>
                                    <span>받는사람</span>
                                    <p>{orderInfo?.userInfo?.addressee}</p>
                                </li>
                                <li>
                                    <span>주소</span>
                                    <p>
                                        {String(
                                            orderInfo?.userInfo?.defaultAddress
                                        ) +
                                            String(
                                                orderInfo?.userInfo?.subAddress
                                            )}
                                    </p>
                                </li>
                                <li>
                                    <span>연락처</span>
                                    <p>
                                        {String(orderInfo?.userInfo?.phone1) +
                                            String(
                                                orderInfo?.userInfo?.phone2
                                            ) +
                                            String(orderInfo?.userInfo?.phone3)}
                                    </p>
                                </li>
                                <li>
                                    <span>배송요청</span>
                                    <p>{orderInfo?.deliveryMsg}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order__box order__box--pb30">
                        <div className="order__title">
                            <strong>주문상품</strong>
                        </div>
                        <div className="order__content">
                            {orderInfo?.items?.map((item) => {
                                return item.options.map((option) => {
                                    return (
                                        <div
                                            className="order__product"
                                            key={option.key}
                                        >
                                            <div className="order__image">
                                                <img
                                                    src={`/uploads/product/${item.data.thumb}`}
                                                    alt=""
                                                />
                                            </div>
                                            <div className="order__desc">
                                                <strong>
                                                    {item.data.title}
                                                </strong>
                                                <p>{option.value.label}</p>
                                                <ul>
                                                    <li>
                                                        {option.value.quantity}
                                                        개
                                                    </li>
                                                    <li>
                                                        상품구매금액:{" "}
                                                        {Number(
                                                            item.data.price
                                                        ) +
                                                            Number(
                                                                option.value
                                                                    .price
                                                            )?.toLocaleString()}
                                                        원
                                                    </li>
                                                    <li>기본배송</li>
                                                </ul>
                                            </div>
                                        </div>
                                    );
                                });
                            })}
                            <div className="order__accordion">
                                <div className="order__tit">
                                    <button>
                                        <span>[기본배송]</span>
                                    </button>
                                </div>
                                <ul>
                                    <li>
                                        <span>상품구매금액</span>
                                        <strong>
                                            {orderInfo?.totalPrice?.toLocaleString()}
                                            원
                                        </strong>
                                    </li>
                                    <li>
                                        <span>배송비</span>
                                        <strong>{"3,500"}원</strong>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div className="order__box order__box--pb20">
                        <div className="order__title">
                            <strong>결제정보</strong>
                        </div>
                        <div className="order__content order__content--nobd order__content--between">
                            <ul>
                                <li>
                                    <span>주문상품</span>
                                    <p>
                                        {orderInfo?.totalPrice?.toLocaleString()}
                                        원
                                    </p>
                                </li>
                                <li>
                                    <span>배송비</span>
                                    <p>3,500원</p>
                                </li>
                            </ul>
                            <div className="order__pay">
                                <strong>결제금액</strong>
                                <b>
                                    {(
                                        orderInfo?.totalPrice + 3500
                                    ).toLocaleString()}
                                    원
                                </b>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__title">
                            <strong>추가입력</strong>
                        </div>
                        <div className="order__content">
                            <ul>
                                <li>
                                    <span>새벽배송 출입정보</span>
                                    <p>{orderInfo?.deliveryMsg}</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__title">
                            <strong>적립 혜택</strong>
                        </div>
                        <div className="order__content order__content--nobd order__content--between">
                            <ul>
                                <li>
                                    <span>회원 적립금</span>
                                    <p>원</p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order__mileage">
                        <strong>적립 예정금액</strong>
                        <b>원</b>
                    </div>
                </div>
                <div className="order__footer">
                    <ul>
                        <li>
                            <Link
                                to="/mypage/orderHistory"
                                className="btn btn-square btn-square--white"
                            >
                                <span className="btn btn-square__text">
                                    주문확인하기
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/product/all"
                                className="btn btn-square btn-square--black"
                            >
                                <span className="btn btn-square__text">
                                    쇼핑계속하기
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default OrderResult;
