import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeCartOption } from "../../modules/cartList";
import { removeOrderOption } from "../../modules/orderList";
import axios from "axios";

function OrderResult() {
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleButton = useRef([]);
    const userInfo = useSelector((state) => state.user);
    const cartList = useSelector((state) => state.cart.cartList);
    const orderList = useSelector((state) => state.order.orderList);
    const [inputValue, setInputValue] = useState({
        addressee: "",
        defaultAddress: "",
        subAddress: "",
        emailId: "",
        phone1: "",
        phone2: "",
        phone3: "",
        nonMemberPW: "",
        confirmNonMemberPW: "",
    });
    const [selectedValue, setSelectedValue] = useState({
        email: "",
        msg: "",
    });
    const [selectedPayment, setSelectedPayment] = useState("");
    const [checkboxValue, setCheckboxValue] = useState({
        agreeAll: false,
        mallAgree: false,
        personalAgree: false,
    });
    const [optionTotalQuantity, setOptionTotalQuantity] = useState(0);

    const handleInputChange = (e) => {
        setInputValue({
            ...inputValue,
            [e.target.name]: e.target.value,
        });
    };

    const handlePaymentChange = (e) => {
        setSelectedPayment(e.target.value);
    };

    const handleSelectChange = (e) => {
        setSelectedValue({
            [e.target.name]: e.target.value,
        });
    };

    const handleCheck = (e) => {
        const { name, checked } = e.target;

        if (name === "agreeAll") {
            setCheckboxValue({
                agreeAll: checked,
                mallAgree: checked,
                personalAgree: checked,
            });
        } else {
            setCheckboxValue((prevValue) => ({
                ...prevValue,
                [name]: checked,
            }));
        }
    };

    const removeOption = (e) => {
        const optionId = e.target.value;
        dispatch(removeOrderOption(optionId));
    };

    useEffect(() => {
        toggleButton.current.forEach((button, index) => {
            if (button) {
                button.addEventListener("click", function () {
                    this.classList.toggle("active");
                    this.parentNode.nextSibling.classList.toggle("hidden");
                });
            }
        });
    }, []);

    const totalPrice = orderList
        .reduce((acc, orderOption) => {
            const calculatedPrices = cartList
                .filter((cartItem) =>
                    cartItem.options.some(
                        (cartOption) => cartOption.key === orderOption.key
                    )
                )
                .map((cartItem) => {
                    const itemPrice = Number(cartItem.data.price);
                    const orderPrice = Number(orderOption.value.price);
                    const quantity = orderOption.value.quantity;

                    return (itemPrice + orderPrice) * quantity;
                });

            return acc.concat(calculatedPrices);
        }, [])
        .reduce((acc, price) => acc + price, 0);

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

    const checkValidOrder = (e) => {
        e.preventDefault();
        for (const key in inputValue) {
            if (!inputValue[key]) {
                switch (key) {
                    case "addressee":
                        alert("수취자 성명 항목은 필수 입력값입니다.");
                        return;
                    case "defaultAddress":
                        alert("기본주소 항목은 필수 입력값입니다.");
                        return;
                    case "subAddress":
                        alert("나머지 주소 항목은 필수 입력값입니다.");
                        return;
                    case "phone1":
                        alert("휴대전화 항목은 필수 입력값입니다.");
                        return;
                    case "phone2":
                        alert("휴대전화 항목은 필수 입력값입니다.");
                        return;
                    case "phone3":
                        alert("휴대전화 항목은 필수 입력값입니다.");
                        return;
                    case "nonMemberPW":
                        alert(
                            "비회원 주문조회 비밀번호 항목은 필수 입력값입니다."
                        );
                        return;
                    case "confirmNonMemberPW":
                        alert(
                            "비회원 주문조회 비밀번호를 한번 더 입력해 주세요."
                        );
                        return;
                    default:
                        break;
                }
            }
        }
        if (inputValue.nonMemberPW !== inputValue.confirmNonMemberPW) {
            alert(
                "비회원 주문조회 비밀번호와 비밀번호 확인이 일치하지 않습니다."
            );
            return;
        }
        if (!selectedPayment) {
            alert("결제수단을 선택하셔야 합니다.");
            return;
        }
        if (!checkboxValue.agreeAll || !checkboxValue.mallAgree) {
            alert("약관에 모두 동의하셔야 합니다.");
            return;
        }

        orderList.forEach((option) => {
            cartList.filter((item, index) => {
                console.log(item, option);
            });
        });

        alert("주문이 완료되었습니다.");
        orderList.forEach((option) => {
            dispatch(removeCartOption(option.key));
        });

        if (userInfo.state === "member" && userInfo.token) {
            orderList.forEach(async (option) => {
                await axios.post("http://localhost:4000/api/removeCartOption", {
                    loginData: { id: userInfo.userId },
                    optionKey: option.key,
                });
            });
        }

        navigate("/order/orderResult");
    };

    return (
        <div className="order order--result">
            <div className="order__inner">
                <div className="order__header">
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
                                    state={{ title: ["마이 쇼핑", "주문조회"] }}
                                >
                                    마이페이지
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="order__body">
                    <h3>주문완료</h3>
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
                                        <strong>20241112-0000573</strong>
                                    </li>
                                    <li>
                                        <span>결제금액</span>
                                        <strong>13,100원</strong>
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
                                    <p>토스</p>
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
                                    <p>김주형</p>
                                </li>
                                <li>
                                    <span>주소</span>
                                    <p>수원시</p>
                                </li>
                                <li>
                                    <span>연락처</span>
                                    <p>010010101</p>
                                </li>
                                <li>
                                    <span>배송요청</span>
                                    <p></p>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="order__box order__box--pb30">
                        <div className="order__title">
                            <strong>주문상품</strong>
                        </div>
                        <div className="order__content">
                            <div className="order__product">
                                <div className="order__image">
                                    <img src="" alt="" />
                                </div>
                                <div className="order__desc">
                                    <strong>
                                        [다노] 닭가슴살칩 3종_저칼로리 식단관리
                                        고단백 간식
                                    </strong>
                                    <p>[옵션: 닭가슴살칩_바베큐맛(3개)]</p>
                                    <ul>
                                        <li>수량: 1개</li>
                                        <li>상품구매금액: 9,600원</li>
                                        <li>기본배송</li>
                                    </ul>
                                </div>
                            </div>
                            <div className="order__accordion">
                                <div className="order__tit">
                                    <button>
                                        <span>[기본배송]</span>
                                    </button>
                                </div>
                                <ul>
                                    <li>
                                        <span>상품구매금액</span>
                                        <strong>원</strong>
                                    </li>
                                    <li>
                                        <span>배송비</span>
                                        <strong>원</strong>
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
                                    <p>원</p>
                                </li>
                                <li>
                                    <span>배송비</span>
                                    <p>원</p>
                                </li>
                            </ul>
                            <div className="order__pay">
                                <strong>결제금액</strong>
                                <b>원</b>
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
                                    <p>
                                        받으실 장소 : 문 앞에 놓아주세요. ||
                                        공동현관 출입 방법 : 기타(단독입니다. 문
                                        앞에 놓아주세요.)
                                    </p>
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
                                to=""
                                className="btn btn-square btn-square--white"
                            >
                                <span className="btn btn-square__text">
                                    주문확인하기
                                </span>
                            </Link>
                        </li>
                        <li>
                            <Link
                                to=""
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
