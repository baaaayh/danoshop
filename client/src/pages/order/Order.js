import React, { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { removeCartOption } from "../../modules/cartList";
import { removeOrderOption } from "../../modules/orderList";
import { useDaumPostcodePopup } from "react-daum-postcode";
import axios from "axios";

function Order({ previousPath }) {
    const [submitting, setSubmitting] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const toggleButton = useRef([]);
    const userInfo = useSelector((state) => state.user);
    const cartList = useSelector((state) => state.cart.cartList);
    const orderList = useSelector((state) => state.order.orderList);
    const [inputValue, setInputValue] = useState({
        zoneCode: "",
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

    const { email, msg } = selectedValue;

    const [selectedPayment, setSelectedPayment] = useState("");
    const [checkboxValue, setCheckboxValue] = useState({
        agreeAll: false,
        mallAgree: false,
        personalAgree: false,
    });
    const [optionTotalQuantity, setOptionTotalQuantity] = useState(0);
    const [phoneMsg, setPhoneMsg] = useState({
        phone1: null,
        phone2: null,
        phone3: null,
    });

    const handleInputChange = useCallback(
        (e) => {
            const value = e.target.value;

            if (e.target.name === "phone1") {
                if (
                    value === "010" ||
                    value === "016" ||
                    value === "019" ||
                    value === "011"
                ) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone1: null,
                    });
                } else {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone1: "휴대전화 번호 첫째 자리를 정확히 입력해 주세요.",
                    });
                }
            }
            if (e.target.name === "phone2") {
                if (value.length < 3) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone2: "휴대전화 번호의 가운데 자리는 최소 3자리 이상 입력해야 합니다.",
                    });
                }
                if (value.length === 3 || value.length === 4) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone2: null,
                    });
                }
                if (value.length > 4) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone2: "휴대전화 번호의 가운데 자리는 최대 4자리까지 입력 가능합니다.",
                    });
                }
            }
            if (e.target.name === "phone3") {
                if (value.length < 4) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone3: "휴대전화 번호의 마지막 자리는 4자리로 입력 가능합니다.",
                    });
                }
                if (value.length === 4) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone3: null,
                    });
                }
                if (value.length > 4) {
                    setPhoneMsg({
                        ...phoneMsg,
                        phone3: "휴대전화 번호의 마지막 자리는 최대 4자리까지 입력 가능합니다.",
                    });
                    return;
                }
            }
            setInputValue({
                ...inputValue,
                [e.target.name]: e.target.value,
            });
        },
        [inputValue, phoneMsg]
    );

    const handlePaymentChange = useCallback((e) => {
        setSelectedPayment(e.target.value);
    }, []);

    const handleSelectChange = useCallback((e) => {
        setSelectedValue({
            [e.target.name]: e.target.value,
        });

        if (e.target.name === "email") {
            directInput.current.style.display = "none";
            if (e.target.value === "직접입력") {
                directInput.current.style.display = "block";
            }
        }
    }, []);

    const handleCheck = useCallback((e) => {
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
    }, []);

    const removeOption = useCallback(
        (e) => {
            const optionId = e.target.value;
            dispatch(removeOrderOption(optionId));
        },
        [dispatch]
    );

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
    }, [cartList]);

    const checkValidOrder = useCallback(
        async (e) => {
            try {
                e.preventDefault();
                if (submitting) return;
                setSubmitting(true);

                for (const key in inputValue) {
                    if (!inputValue[key]) {
                        let alertMsg = "";
                        switch (key) {
                            case "addressee":
                                alertMsg =
                                    "수취자 성명 항목은 필수 입력값입니다.";
                                break;
                            case "defaultAddress":
                                alertMsg = "기본주소 항목은 필수 입력값입니다.";
                                break;
                            case "phone1":
                            case "phone2":
                            case "phone3":
                                alertMsg = "휴대전화 항목은 필수 입력값입니다.";
                                break;
                            default:
                                break;
                        }
                        if (alertMsg) {
                            alert(alertMsg);
                            return;
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

                const orderItems = cartList.filter((item) =>
                    orderList.some((orderOption) =>
                        item.options.some(
                            (cartOption) => orderOption.key === cartOption.key
                        )
                    )
                );

                const today = new Date()
                    .toISOString()
                    .slice(0, 10)
                    .replace(/-/g, "");
                const orderIdentify = String(
                    Math.floor(Math.random() * 10000000)
                ).padStart(7, "0");
                const orderId = today + "-" + orderIdentify;
                const orderDate = new Date().toISOString().slice(0, 10);

                const orderObj = {
                    orderDate,
                    orderId,
                    userInfo: inputValue,
                    selectedPayment,
                    emailDomain: email,
                    deliveryMsg: msg,
                    items: orderItems,
                    totalPrice: totalPrice,
                };

                const response = await axios.post(
                    "http://localhost:4000/api/makeOrderHistory",
                    {
                        userId: userInfo.userId,
                        orderInfo: orderObj,
                    }
                );

                if (
                    !location.state.passRemoveCart ||
                    previousPath === "/order/cart"
                ) {
                    orderList.forEach((option) => {
                        dispatch(removeCartOption(option.key));
                    });
                }

                if (userInfo.state === "member" && userInfo.token) {
                    await Promise.all(
                        orderList.map((option) =>
                            axios.post(
                                "http://localhost:4000/api/removeCartOption",
                                {
                                    loginData: { id: userInfo.userId },
                                    optionKey: option.key,
                                }
                            )
                        )
                    );
                }

                alert(response.data.msg);
                if (response.data.success) {
                    navigate("/order/orderResult", {
                        state: { orderId },
                    });
                }
            } catch (error) {
                console.error("Order failed:", error);
            } finally {
                setSubmitting(false);
            }
        },
        [
            cartList,
            checkboxValue.agreeAll,
            checkboxValue.mallAgree,
            dispatch,
            email,
            inputValue,
            location.state,
            previousPath,
            msg,
            navigate,
            orderList,
            selectedPayment,
            submitting,
            totalPrice,
            userInfo.state,
            userInfo.token,
            userInfo.userId,
        ]
    );

    const directInput = useRef();

    const scriptUrl =
        "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
    const open = useDaumPostcodePopup(scriptUrl);

    const handleComplete = useCallback(
        (data) => {
            let zoneCode = data.zonecode;
            let fullAddress = data.address;
            let extraAddress = "";

            if (data.addressType === "R") {
                if (data.bname !== "") {
                    extraAddress += data.bname;
                }
                if (data.buildingName !== "") {
                    extraAddress +=
                        extraAddress !== ""
                            ? `, ${data.buildingName}`
                            : data.buildingName;
                }
                fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
            }

            setInputValue({
                ...inputValue,
                zoneCode: zoneCode,
                defaultAddress: fullAddress,
            });
        },
        [inputValue]
    );

    const handleClick = useCallback(() => {
        open({ onComplete: handleComplete });
    }, [open, handleComplete]);

    return (
        <div className="order">
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
                    <h3>주문/결제</h3>
                </div>
                <div className="order__body">
                    <div className="order__box">
                        <h4>
                            <button
                                type="button"
                                ref={(el) => (toggleButton.current[0] = el)}
                            >
                                배송지
                            </button>
                        </h4>
                        <div className="order__toggle">
                            <div className="order__info">
                                <div className="order__form">
                                    <div className="form">
                                        <div className="form__row">
                                            <div className="form__tit">
                                                받는사람
                                                <span className="star">*</span>
                                            </div>
                                            <div className="form__content">
                                                <input
                                                    type="text"
                                                    name="addressee"
                                                    value={inputValue.addressee}
                                                    onChange={handleInputChange}
                                                />
                                            </div>
                                        </div>

                                        <div className="form__row">
                                            <div className="form__tit">
                                                주소
                                                <span className="star">*</span>
                                            </div>
                                            <div className="form__content">
                                                <ul>
                                                    <li>
                                                        <div className="zip-code">
                                                            <input
                                                                type="text"
                                                                name="zoneCode"
                                                                value={
                                                                    inputValue.zoneCode
                                                                }
                                                                onChange={
                                                                    handleInputChange
                                                                }
                                                                readOnly={true}
                                                            />
                                                            <button
                                                                type="button"
                                                                className="btn btn-square--black"
                                                                onClick={
                                                                    handleClick
                                                                }
                                                            >
                                                                <span className="btn btn-square__text">
                                                                    주소검색
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </li>
                                                    <li>
                                                        <input
                                                            type="text"
                                                            placeholder="기본주소"
                                                            name="defaultAddress"
                                                            value={
                                                                inputValue.defaultAddress
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                            readOnly={true}
                                                        />
                                                    </li>
                                                    <li>
                                                        <input
                                                            type="text"
                                                            placeholder="나머지 주소(필수)"
                                                            name="subAddress"
                                                            value={
                                                                inputValue.subAddress
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="form__row form__row--vertical">
                                            <div className="form__tit">
                                                휴대전화
                                                <span className="star">*</span>
                                            </div>
                                            <div className="form__content ">
                                                <div className="form__phone">
                                                    <input
                                                        type="number"
                                                        name="phone1"
                                                        value={
                                                            inputValue.phone1
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    -
                                                    <input
                                                        type="number"
                                                        name="phone2"
                                                        value={
                                                            inputValue.phone2
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                    -
                                                    <input
                                                        type="number"
                                                        name="phone3"
                                                        value={
                                                            inputValue.phone3
                                                        }
                                                        onChange={
                                                            handleInputChange
                                                        }
                                                    />
                                                </div>
                                                <p className="red-text">
                                                    {phoneMsg.phone1}
                                                </p>
                                                <p className="red-text">
                                                    {phoneMsg.phone2}
                                                </p>
                                                <p className="red-text">
                                                    {phoneMsg.phone3}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="form__row">
                                            <div className="form__tit">
                                                이메일
                                            </div>
                                            <div className="form__content form__content--cols">
                                                <input type="text" />@
                                                <div className="email-form">
                                                    <div>
                                                        <input
                                                            type="text"
                                                            placeholder="직접입력"
                                                            name="emailId"
                                                            ref={directInput}
                                                            value={
                                                                inputValue.emailId
                                                            }
                                                            onChange={
                                                                handleInputChange
                                                            }
                                                        />
                                                        <select
                                                            name="email"
                                                            value={
                                                                selectedValue.email
                                                            }
                                                            onChange={
                                                                handleSelectChange
                                                            }
                                                        >
                                                            <option value="none">
                                                                -이메일 선택-
                                                            </option>
                                                            <option value="직접입력">
                                                                직접입력
                                                            </option>
                                                            <option value="naver.com">
                                                                naver.com
                                                            </option>
                                                            <option value="daum.net">
                                                                daum.net
                                                            </option>
                                                            <option value="nate.com">
                                                                nate.com
                                                            </option>
                                                        </select>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="order__msg">
                                <select
                                    id=""
                                    name="msg"
                                    value={selectedValue.msg}
                                    onChange={handleSelectChange}
                                >
                                    <option value="-- 메시지 선택 (선택사항) --">
                                        -- 메시지 선택 (선택사항) --
                                    </option>
                                    <option value="배송 전에 미리 연락바랍니다.">
                                        배송 전에 미리 연락바랍니다.
                                    </option>
                                    <option value="부재 시 경비실에 맡겨주세요.">
                                        부재 시 경비실에 맡겨주세요.
                                    </option>
                                    <option value="부재 시 문 앞에 놓아주세요.">
                                        부재 시 문 앞에 놓아주세요.
                                    </option>
                                    <option value="빠른 배송 부탁드립니다.">
                                        빠른 배송 부탁드립니다.
                                    </option>
                                    <option value="택배함에 보관해 주세요.">
                                        택배함에 보관해 주세요.
                                    </option>
                                    <option value="직접 입력">직접 입력</option>
                                </select>
                            </div>
                            <div className="order__form order__form--gray">
                                <h5>비회원 주문조회 비밀번호</h5>
                                <div className="form">
                                    <div className="form__row">
                                        <div className="form__tit">
                                            비밀번호
                                        </div>
                                        <div className="form__content">
                                            <input
                                                type="password"
                                                name="nonMemberPW"
                                                value={inputValue.nonMemberPW}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="form__row">
                                        <div className="form__tit">
                                            비밀번호 확인
                                        </div>
                                        <div className="form__content">
                                            <input
                                                type="password"
                                                name="confirmNonMemberPW"
                                                value={
                                                    inputValue.confirmNonMemberPW
                                                }
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button
                                type="button"
                                ref={(el) => (toggleButton.current[1] = el)}
                            >
                                주문상품
                            </button>
                        </h4>
                        <div className="order__toggle">
                            <div className="order__list">
                                <ul>
                                    {orderList.map((orderOption, index) => {
                                        return cartList.map((cartItem) => {
                                            return cartItem.options.map(
                                                (cartOption) => {
                                                    if (
                                                        cartOption.key ===
                                                        orderOption.key
                                                    ) {
                                                        return (
                                                            <li
                                                                key={
                                                                    orderOption.key
                                                                }
                                                            >
                                                                <div className="order__item">
                                                                    <div className="order__figure">
                                                                        <Link
                                                                            to={`/product/detail/all/${cartItem.id}`}
                                                                        >
                                                                            <img
                                                                                src={`/uploads/product/${cartItem.data.thumb}`}
                                                                                alt=""
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                    <div className="order__desc">
                                                                        <div className="order__proudct"></div>
                                                                        <div className="order__option">
                                                                            {`[옵션:
                                                                            ${orderOption.value.label}]`}
                                                                        </div>
                                                                        <div className="order__quantity">{`수량: ${orderOption.value.quantity}개`}</div>
                                                                        <div className="order__price">{`${
                                                                            (Number(
                                                                                cartItem
                                                                                    .data
                                                                                    .price
                                                                            ) +
                                                                                Number(
                                                                                    orderOption
                                                                                        .value
                                                                                        .price
                                                                                )) *
                                                                            orderOption
                                                                                .value
                                                                                .quantity
                                                                        }원`}</div>
                                                                    </div>
                                                                    <button
                                                                        type="button"
                                                                        onClick={
                                                                            removeOption
                                                                        }
                                                                        value={
                                                                            orderOption.key
                                                                        }
                                                                    >
                                                                        삭제
                                                                    </button>
                                                                </div>
                                                            </li>
                                                        );
                                                    }
                                                    return null;
                                                }
                                            );
                                        });
                                    })}
                                </ul>
                            </div>
                            <div className="order__charge">
                                <span>배송비</span>
                                <b>3,500 원</b>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button
                                type="button"
                                ref={(el) => (toggleButton.current[2] = el)}
                            >
                                결제정보
                            </button>
                        </h4>
                        <div className="order__toggle">
                            <div className="order__bill">
                                <ul>
                                    <li>
                                        <span>주문상품</span>
                                        <b>{`${Number(
                                            totalPrice
                                        ).toLocaleString()} 원`}</b>
                                    </li>
                                    <li>
                                        <span>배송비</span>
                                        <b>3,500 원</b>
                                    </li>
                                    <li>
                                        <span>할인/부가결제</span>
                                        <b>0 원</b>
                                    </li>
                                </ul>
                            </div>
                            <div className="order__total">
                                <span>최종 결제 금액</span>
                                <strong>{`${Number(
                                    totalPrice + 3500
                                ).toLocaleString()} 원`}</strong>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <h4>
                            <button
                                type="button"
                                ref={(el) => (toggleButton.current[3] = el)}
                            >
                                결제수단
                            </button>
                        </h4>
                        <div className="order__toggle">
                            <div className="order__payment">
                                <p>결제수단 선택</p>
                                <ul>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment1"
                                            value="신용카드"
                                            checked={
                                                selectedPayment === "신용카드"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment1">
                                            신용카드
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment2"
                                            value="가상계좌"
                                            checked={
                                                selectedPayment === "가상계좌"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment2">
                                            가상계좌
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment3"
                                            value="휴대폰"
                                            checked={
                                                selectedPayment === "휴대폰"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment3">휴대폰</label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment4"
                                            value="카카오페이"
                                            checked={
                                                selectedPayment === "카카오페이"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment4">
                                            카카오페이
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment5"
                                            value="네이버페이"
                                            checked={
                                                selectedPayment === "네이버페이"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment5">
                                            네이버페이
                                        </label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment6"
                                            value="페이코"
                                            checked={
                                                selectedPayment === "페이코"
                                            }
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment6">페이코</label>
                                    </li>
                                    <li>
                                        <input
                                            type="radio"
                                            name="payment"
                                            id="payment7"
                                            value="토스"
                                            checked={selectedPayment === "토스"}
                                            onChange={handlePaymentChange}
                                        />
                                        <label htmlFor="payment7">토스</label>
                                    </li>
                                </ul>
                                <div className="order__caution"></div>
                            </div>
                        </div>
                    </div>
                    <div className="order__box">
                        <div className="order__terms">
                            <ul>
                                <li>
                                    <label htmlFor="agreeAll">
                                        <input
                                            type="checkbox"
                                            id="agreeAll"
                                            name="agreeAll"
                                            checked={checkboxValue.agreeAll}
                                            onChange={handleCheck}
                                        />
                                        모든 약관 동의
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="mallAgree">
                                        <input
                                            type="checkbox"
                                            id="mallAgree"
                                            name="mallAgree"
                                            checked={checkboxValue.mallAgree}
                                            onChange={handleCheck}
                                        />
                                        [필수] 쇼핑몰 이용약관 동의
                                    </label>
                                </li>
                                <li>
                                    <label htmlFor="personalAgree">
                                        <input
                                            type="checkbox"
                                            id="personalAgree"
                                            name="personalAgree"
                                            checked={
                                                checkboxValue.personalAgree
                                            }
                                            onChange={handleCheck}
                                        />
                                        [필수] 개인정보 수집 및 이용 동의
                                    </label>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link
                        to=""
                        className="order__submit"
                        onClick={checkValidOrder}
                    >
                        {`${Number(
                            totalPrice + 3500
                        ).toLocaleString()} 원 결제하기`}
                    </Link>
                </div>
                <div className="order__footer">
                    <div className="order__help">
                        <ul>
                            <li>
                                무이자할부가 적용되지 않은 상품과 무이자할부가
                                가능한 상품을 동시에 구매할 경우 전체 주문 상품
                                금액에 대해 무이자할부가 적용되지 않습니다.
                                무이자할부를 원하시는 경우 장바구니에서
                                무이자할부 상품만 선택하여 주문하여 주시기
                                바랍니다.
                            </li>
                            <li>
                                최소 결제 가능 금액은 결제금액에서 배송비를
                                제외한 금액입니다.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Order;
