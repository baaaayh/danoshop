import React, { useState, useEffect } from "react";
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import {
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../../modules/cartList";
import SubContentsSmall from "../../components/SubContentsSmall";
import BreadCrumb from "../../components/BreadCrumb";
import SubTitle from "../../components/SubTitle";
import styles from "./Cart.module.scss";

function Cart() {
    const navigate = useNavigate();
    const [cartList, setCartList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const cartData = useSelector((state) => state.cart.cartList);
    const userInfo = useSelector((state) => state.user);
    const token = useSelector((state) => state.user.token);
    const params = useParams();
    const location = useLocation();
    const dispatch = useDispatch();
    const title = location.state?.title || ["전상품"];

    useEffect(() => {
        setCartList(cartData);
    }, [cartData]);

    useEffect(() => {
        const totalQuantity = cartList.reduce((acc, item) => {
            return (
                acc +
                item.options.reduce((optAcc, option) => {
                    return optAcc + (option.value.quantity || 0);
                }, 0)
            );
        }, 0);
        setTotalQuantity(totalQuantity);
    }, [cartList]);

    useEffect(() => {
        const totalPrice = cartList.reduce((acc, item) => {
            return (
                acc +
                item.options.reduce((itemAcc, option) => {
                    const itemTotal =
                        (Number(item.price) - Number(option.value.price)) *
                        Number(option.value.quantity);
                    return itemAcc + itemTotal;
                }, 0)
            );
        }, 0);

        setTotalPrice(totalPrice);
    }, [cartList, userInfo.userId]);

    useEffect(() => {
        const fetchCartData = async () => {
            if (userInfo.isLoggedIn) {
                dispatch(clearCart());

                try {
                    const response = await axios.post(
                        "http://localhost:4000/api/userCart",
                        {
                            loginData: { id: userInfo.userId },
                            localCart: [],
                        }
                    );

                    if (response.data) {
                        setCartList(response.data.cartItems);
                    }
                } catch (error) {
                    console.error("Failed to fetch cart data:", error);
                }
            }
        };

        fetchCartData();
    }, [userInfo, dispatch]);

    const handleQuantityChange = async (itemId, optionKey, change) => {
        const updatedCartList = cartList.map((item) => {
            if (item.id === itemId) {
                const updatedOptions = item.options
                    .map((option) => {
                        if (option.key === optionKey) {
                            const currentQuantity = option.value?.quantity ?? 0;
                            const newQuantity = currentQuantity + change;

                            if (newQuantity <= 0) {
                                const remove =
                                    window.confirm("상품을 삭제 하시겠습니까?");
                                if (remove) {
                                    removeItem(itemId); // 아이템 삭제 처리
                                    return null; // 해당 옵션 제거
                                } else {
                                    console.log(1);
                                    // 삭제를 취소할 경우 수량을 1로 유지
                                    return {
                                        ...option,
                                        value: {
                                            ...option.value,
                                            quantity: 1, // 수량을 1로 유지
                                        },
                                    };
                                }
                            }
                        }
                        return option; // 해당 옵션이 아닐 경우 그대로 반환
                    })
                    .filter(Boolean); // null 제거

                return { ...item, options: updatedOptions }; // 아이템 반환
            }
            return item; // 해당 아이템이 아닐 경우 그대로 반환
        });

        // 상태 업데이트
        setCartList(updatedCartList);
        dispatch(updateCartItem({ itemId, optionKey, quantity: change }));

        // 서버에 업데이트 요청
        await updateServerCart(updatedCartList);
    };

    // 서버에 장바구니 업데이트 요청을 위한 함수
    const updateServerCart = async (updatedCartList) => {
        try {
            const response = await axios.post(
                "http://localhost:4000/api/userCart",
                {
                    loginData: { id: userInfo.userId },
                    localCart: updatedCartList,
                }
            );
            console.log(response.data); // 응답 확인
        } catch (error) {
            console.error("Failed to update cart on server:", error);
        }
    };

    const removeItem = async (id) => {
        const updatedCartList = cartList.filter((item) => item.id !== id);
        setCartList(updatedCartList);
        dispatch(removeCartItem(id));

        try {
            const response = await axios.post(
                "http://localhost:4000/api/userCart",
                {
                    loginData: { id: userInfo.userId },
                    localCart: updatedCartList,
                }
            );
        } catch (error) {
            console.error("Failed to update cart on server:", error);
        }
    };

    const goToPayment = () => {
        if (token) {
            navigate("/order/payment");
        } else {
            navigate("/member/login");
        }
    };

    return (
        <SubContentsSmall>
            <BreadCrumb title={title} path={params} />
            {cartList.length > 0 ? (
                <>
                    <SubTitle title={title} />
                    <div className={styles["step"]}>
                        <ol>
                            <li>1. 장바구니</li>
                            <li>2. 주문서작성</li>
                            <li>3. 주문완료</li>
                        </ol>
                    </div>
                    <div className={styles["cart"]}>
                        <div className={styles["cart__view"]}>
                            <div className={styles["cart__title"]}>
                                <h2>장바구니 상품</h2>
                            </div>
                            <div className={styles["cart__contents"]}>
                                <div className={styles["cart__type"]}>
                                    일반상품 ({totalQuantity})
                                </div>
                                <div className={styles["cart__list"]}>
                                    <ul>
                                        {cartList.map((item) =>
                                            item.options.map(
                                                (option, index) => (
                                                    <li
                                                        className={
                                                            styles["cart__item"]
                                                        }
                                                        key={`${item.id}-${index}`}
                                                    >
                                                        <div
                                                            className={
                                                                styles[
                                                                    "cart__container"
                                                                ]
                                                            }
                                                        >
                                                            <div
                                                                className={
                                                                    styles[
                                                                        "cart__chk"
                                                                    ]
                                                                }
                                                            >
                                                                <input type="checkbox" />
                                                            </div>
                                                            <div
                                                                className={
                                                                    styles[
                                                                        "cart__info"
                                                                    ]
                                                                }
                                                            >
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "cart__detail"
                                                                        ]
                                                                    }
                                                                >
                                                                    <div
                                                                        className={
                                                                            styles[
                                                                                "cart__thumb"
                                                                            ]
                                                                        }
                                                                    >
                                                                        <Link
                                                                            to={`/product/detail/all/${item.data.type}/${item.data.id}`}
                                                                        >
                                                                            <img
                                                                                src={`/uploads/product/${item.data.thumb}`}
                                                                                alt=""
                                                                            />
                                                                        </Link>
                                                                    </div>
                                                                    <div
                                                                        className={
                                                                            styles[
                                                                                "cart__text"
                                                                            ]
                                                                        }
                                                                    >
                                                                        <div>
                                                                            {
                                                                                item
                                                                                    .data
                                                                                    .title
                                                                            }
                                                                        </div>
                                                                        <div>{`${Number(
                                                                            option
                                                                                .value
                                                                                .price
                                                                        ).toLocaleString()} 원`}</div>
                                                                        <div>
                                                                            배송:{" "}
                                                                            {`${item.data.deliveryCharge} / ${item.data.deliveryType}`}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "cart__option"
                                                                        ]
                                                                    }
                                                                >
                                                                    <p>
                                                                        {
                                                                            option
                                                                                .value
                                                                                .label
                                                                        }
                                                                    </p>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "cart__quantity"
                                                                        ]
                                                                    }
                                                                >
                                                                    <span>
                                                                        수량
                                                                    </span>
                                                                    <div>
                                                                        <div className="quantity-control">
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleQuantityChange(
                                                                                        item.id,
                                                                                        option.key,
                                                                                        -1
                                                                                    )
                                                                                }
                                                                            >
                                                                                -
                                                                            </button>
                                                                            <div className="quantity-control__view">
                                                                                {
                                                                                    option
                                                                                        .value
                                                                                        .quantity
                                                                                }
                                                                            </div>
                                                                            <button
                                                                                type="button"
                                                                                onClick={() =>
                                                                                    handleQuantityChange(
                                                                                        item.id,
                                                                                        option.key,
                                                                                        1
                                                                                    )
                                                                                }
                                                                            >
                                                                                +
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "cart__price"
                                                                        ]
                                                                    }
                                                                >
                                                                    <span>
                                                                        주문금액
                                                                    </span>
                                                                    <div>
                                                                        <strong>{`${(
                                                                            (Number(
                                                                                item.price
                                                                            ) +
                                                                                Number(
                                                                                    option
                                                                                        .value
                                                                                        .price
                                                                                )) *
                                                                            Number(
                                                                                option
                                                                                    .value
                                                                                    .quantity
                                                                            )
                                                                        ).toLocaleString()}`}</strong>{" "}
                                                                        원
                                                                    </div>
                                                                </div>
                                                                <div
                                                                    className={
                                                                        styles[
                                                                            "cart__button"
                                                                        ]
                                                                    }
                                                                >
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-square"
                                                                    >
                                                                        <span className="btn-square__text">
                                                                            관심상품
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        type="button"
                                                                        className="btn btn-square"
                                                                    >
                                                                        <span className="btn-square__text">
                                                                            주문하기
                                                                        </span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <button
                                                                type="button"
                                                                className="btn btn-remove"
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id
                                                                    )
                                                                }
                                                            >
                                                                삭제
                                                            </button>
                                                        </div>
                                                    </li>
                                                )
                                            )
                                        )}
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className={styles["cart__right"]}>
                            <div className={styles["cart__calc"]}>
                                <ul>
                                    <li>
                                        <span>총 상품금액</span>
                                        <div>{`${totalPrice.toLocaleString()} 원`}</div>
                                    </li>
                                    <li>
                                        <span>총 배송비</span>
                                        <div>{`3500 원`}</div>
                                    </li>
                                </ul>
                                <div className={styles["cart__total"]}>
                                    <b>결제예정금액</b>
                                    <div>
                                        <strong>{`${(
                                            Number(totalPrice) + 3500
                                        ).toLocaleString()}`}</strong>
                                        <span>원</span>
                                    </div>
                                </div>
                            </div>
                            <div className={styles["cart__order"]}>
                                <ul>
                                    <li>
                                        <button
                                            type="button"
                                            className="btn btn-square btn-square--black"
                                            onClick={goToPayment}
                                        >
                                            <span className="btn-square__text">
                                                전체상품주문
                                            </span>
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            type="button"
                                            className="btn btn-square"
                                            onClick={goToPayment}
                                        >
                                            <span className="btn-square__text">
                                                선택상품주문
                                            </span>
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <div className="no-item">
                    <div>
                        <img src="/images/icons/icon_no_item.svg" alt="" />
                    </div>
                    <p>장바구니가 비어 있습니다.</p>
                </div>
            )}
            <div>
                <div className="guide">
                    <h3>이용안내</h3>
                    <div className="guide__text">
                        <div className="guide__row">
                            <h4 className="guide__title">장바구니 이용안내</h4>
                            <ul className="dot-list">
                                <li>
                                    선택하신 상품의 수량을 변경하시려면 수량변경
                                    후 [변경] 버튼을 누르시면 됩니다.
                                </li>
                                <li>
                                    [쇼핑계속하기] 버튼을 누르시면 쇼핑을 계속
                                    하실 수 있습니다.
                                </li>
                                <li>
                                    장바구니와 관심상품을 이용하여 원하시는
                                    상품만 주문하거나 관심상품으로 등록하실 수
                                    있습니다.
                                </li>
                                <li>
                                    파일첨부 옵션은 동일상품을 장바구니에 추가할
                                    경우 마지막에 업로드 한 파일로 교체됩니다.
                                </li>
                            </ul>
                        </div>
                        <div className="guide__row">
                            <h4 className="guide__title">
                                무이자할부 이용안내
                            </h4>
                            <ul className="dot-list">
                                <li>
                                    상품별 무이자할부 혜택을 받으시려면
                                    무이자할부 상품만 선택하여 [주문하기] 버튼을
                                    눌러 주문/결제 하시면 됩니다.
                                </li>
                                <li>
                                    [전체 상품 주문] 버튼을 누르시면 장바구니의
                                    구분없이 선택된 모든 상품에 대한 주문/결제가
                                    이루어집니다.
                                </li>
                                <li>
                                    단, 전체 상품을 주문/결제하실 경우, 상품별
                                    무이자할부 혜택을 받으실 수 없습니다.
                                </li>
                                <li>
                                    무이자할부 상품은 장바구니에서 별도
                                    무이자할부 상품 영역에 표시되어, 무이자할부
                                    상품 기준으로 배송비가 표시됩니다.
                                    <br />
                                    실제 배송비는 함께 주문하는 상품에 따라
                                    적용되오니 주문서 하단의 배송비 정보를
                                    참고해주시기 바랍니다.
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </SubContentsSmall>
    );
}

export default Cart;
