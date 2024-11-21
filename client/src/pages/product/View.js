import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useLocation, useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { addCartItem } from "../../modules/cartList";
import SubContentsSmall from "../../components/layout/SubContentsSmall";
import BreadCrumb from "../../components/layout/BreadCrumb";
import styles from "./View.module.scss";
import LayerPopup from "../../components/layout/LayerPopup";
import { saveOrder, clearOrder } from "../../modules/orderList";

function View() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.user);
    const cartData = useSelector((state) => state.cart.cartList);
    const [updatedLocalCart, setUpdatedLocalCart] = useState([]);
    const [isPopupActive, setIsPopupActive] = useState(false);
    const [selectedOptionId, setSelectedOptionId] = useState();
    const [selectedOptions, setSelectedOptions] = useState([]);
    const [productInfo, setProductInfo] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);
    const [isAdding, setIsAdding] = useState(false);

    const params = useParams();
    const location = useLocation();
    const productId = params.id;
    const pageTitle = location.state?.title || ["전상품"];

    const {
        title,
        summary,
        price,
        config,
        deliveryType,
        deliveryCharge,
        detail,
        view,
    } = productInfo;

    const options = useMemo(
        () => productInfo.options || [],
        [productInfo.options]
    );

    const getProductDetail = useCallback(async () => {
        try {
            const response = await axios.post(
                "http://localhost:4000/api/product",
                { id: productId }
            );
            setProductInfo(response.data.productView[0]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }, [productId]);

    useEffect(() => {
        getProductDetail();
    }, [getProductDetail]);

    useEffect(() => {
        const newTotalPrice = selectedOptions.reduce((total, option) => {
            const optionPrice = option.value.price || 0;
            return (
                total +
                (Number(productInfo.price) + optionPrice) *
                    option.value.quantity
            );
        }, 0);
        setTotalPrice(newTotalPrice);
    }, [selectedOptions, productInfo.price]);

    const handleSelectChange = useCallback(
        (e) => {
            setSelectedOptionId(e.target.value);
            let selectedOption;
            options.some((option) => {
                return Object.keys(option).some((key) => {
                    return option[key].data.some((o) => {
                        if (o.id === e.target.value) {
                            selectedOption = o;
                            return true;
                        }
                        return false;
                    });
                });
            });

            if (selectedOption) {
                setSelectedOptions((prev) => {
                    const existingOptionIndex = prev.findIndex(
                        (option) => option.key === selectedOption.id
                    );

                    if (existingOptionIndex === -1) {
                        return [
                            ...prev,
                            {
                                key: e.target.value,
                                value: {
                                    ...selectedOption,
                                    quantity: 1,
                                },
                            },
                        ];
                    }

                    return prev;
                });
            }

            setSelectedOptionId("");
        },
        [options]
    );

    const handleDeleteOption = useCallback((key) => {
        setSelectedOptions((prev) =>
            prev.filter((option) => option.key !== key)
        );
    }, []);

    const handleQuantityChange = useCallback((key, change) => {
        setSelectedOptions((prev) =>
            prev.map((option) => {
                if (option.key === key) {
                    const currentQuantity = option.value?.quantity ?? 0;
                    const newQuantity = currentQuantity + change;

                    if (newQuantity < 1) {
                        alert("최소 주문 수량은 1개입니다.");
                        return option;
                    }

                    return {
                        ...option,
                        value: {
                            ...option.value,
                            quantity: newQuantity,
                        },
                    };
                } else {
                    return option;
                }
            })
        );
    }, []);

    const handleDuplicateOptions = useCallback(
        (existingCartItems) => {
            existingCartItems.forEach((item) => {
                const selectedOptionKeys = selectedOptions.map(
                    (option) => option.key
                );
                const existingOptionKeys = item.options.map(
                    (option) => option.key
                );

                if (
                    existingOptionKeys.some((key) =>
                        selectedOptionKeys.includes(key)
                    )
                ) {
                    selectedOptions.forEach((selectedOption) => {
                        const existingOption = item.options.find(
                            (option) => option.key === selectedOption.key
                        );
                        if (existingOption) {
                            selectedOption.value = {
                                ...selectedOption.value,
                                quantity:
                                    selectedOption.value.quantity +
                                    existingOption.value.quantity,
                            };
                        }
                    });
                }
            });
        },
        [selectedOptions]
    );

    const openLayerPopup = useCallback(() => {
        setIsPopupActive(true);
    }, []);

    const closeLayerPopup = useCallback(() => {
        setIsPopupActive(false);
    }, []);

    const handleAddToCart = useCallback(
        async (confirm) => {
            if (isAdding) return;
            if (selectedOptions.length <= 0) {
                alert("옵션을 선택해 주세요.");
                return;
            }

            setIsAdding(true);

            try {
                const existingCartItems = cartData || [];
                let isDuplicate = false;

                existingCartItems.forEach((item) => {
                    const selectedOptionKeys = selectedOptions.map(
                        (option) => option.key
                    );
                    const existingOptionKeys = item.options.map(
                        (option) => option.key
                    );

                    if (
                        existingOptionKeys.some((key) =>
                            selectedOptionKeys.includes(key)
                        )
                    ) {
                        isDuplicate = true;
                    }
                });

                if (isDuplicate) {
                    const isConfirmed =
                        confirm &&
                        window.confirm(
                            "동일한 상품이 장바구니에 있습니다. 장바구니에 추가하시겠습니까?"
                        );
                    if (!isConfirmed) {
                        return;
                    }
                }

                const product = {
                    id: productInfo.id,
                    options: selectedOptions,
                    price: productInfo.price,
                    data: { ...productInfo },
                };

                dispatch(addCartItem(product));
                setUpdatedLocalCart((prev) => [...prev, product]);
                openLayerPopup(true);
            } catch (error) {
                console.error("Failed to add to cart:", error);
            } finally {
                setIsAdding(false);
            }
        },
        [
            cartData,
            dispatch,
            isAdding,
            openLayerPopup,
            productInfo,
            selectedOptions,
        ]
    );

    const goToPayment = useCallback(() => {
        let passRemoveCart = true;
        const existingCartItems = cartData || [];
        let isDuplicate = false;

        existingCartItems.forEach((item) => {
            const selectedOptionKeys = selectedOptions.map(
                (option) => option.key
            );
            const existingOptionKeys = item.options.map((option) => option.key);

            if (
                existingOptionKeys.some((key) =>
                    selectedOptionKeys.includes(key)
                )
            ) {
                isDuplicate = true;
            }
        });

        let confirm = false;
        if (isDuplicate) {
            confirm = window.confirm(
                "동일한 상품이 장바구니에 있습니다. 함께 구매하시겠습니까?"
            );
        }

        if (confirm) {
            handleDuplicateOptions(existingCartItems);
        } else {
            passRemoveCart = false;
        }
        dispatch(clearOrder());
        dispatch(saveOrder(selectedOptions));
        if (selectedOptions.length <= 0) {
            alert("주문하실 상품을 선택해 주세요.");
            return;
        }
        if (userInfo.token) {
            navigate("/order/order", {
                state: {
                    orderList: selectedOptions,
                    passRemoveCart,
                },
            });
        } else {
            navigate("/member/login", {
                state: { title: ["로그인"], prevPage: location.pathname },
            });
        }
    }, [
        selectedOptions,
        userInfo,
        location,
        cartData,
        dispatch,
        handleDuplicateOptions,
        navigate,
    ]);

    const layerPopupRef = useRef();

    const updateDbCart = useCallback(async () => {
        try {
            await axios.post("http://localhost:4000/api/userCart", {
                loginData: { id: userInfo.userId },
                localCart: updatedLocalCart,
            });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }, [userInfo.userId, updatedLocalCart]);

    useEffect(() => {
        if (userInfo.state === "member") {
            updateDbCart();
        }
    }, [userInfo.state, updateDbCart]);

    const addWishListItem = useCallback(async () => {
        if (userInfo.token) {
            try {
                let wishList;

                if (selectedOptions.length > 0) {
                    wishList = selectedOptions.map((option) => {
                        const product = {
                            id: productInfo.id,
                            options: selectedOptions,
                            price: String(totalPrice),
                            wishOption: option,
                            data: { ...productInfo },
                        };
                        return product;
                    });
                } else {
                    wishList = [
                        {
                            id: productInfo.id,
                            options: selectedOptions,
                            price: String(totalPrice),
                            data: { ...productInfo },
                        },
                    ];
                }

                await axios.post("http://localhost:4000/api/addWishList", {
                    userId: userInfo.userId,
                    wishList: wishList,
                });

                alert("관심상품으로 등록되었습니다.");
            } catch (error) {
                console.error("Error updating wish list:", error);
            }
        }
    }, [
        userInfo.token,
        productInfo,
        selectedOptions,
        totalPrice,
        userInfo.userId,
    ]);

    const updateRecentView = useCallback(async () => {
        try {
            await axios.post("http://localhost:4000/api/updateRecentView", {
                userId: userInfo.userId,
                recentViewItem: productInfo,
            });
        } catch (error) {
            console.error("Error updating cart:", error);
        }
    }, [userInfo.userId, productInfo]);

    useEffect(() => {
        if (userInfo.token && productInfo.id) {
            updateRecentView();
        }
    }, [userInfo.token, productInfo.id, updateRecentView]);

    return (
        <SubContentsSmall>
            <BreadCrumb title={pageTitle} path={params} />
            <div className={styles["detail-view"]}>
                <div className={styles["detail-view__top"]}>
                    <div className={styles["detail-view__figure"]}>
                        <img src={`/uploads/product/${view}`} alt={title} />
                    </div>
                    <div className={styles["detail-view__info"]}>
                        <h2 className={styles["detail-view__title"]}>
                            {title}
                        </h2>
                        <div className={styles["detail-view__list"]}>
                            <ul>
                                <li>
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        상품요약정보
                                    </span>
                                    <div>{summary}</div>
                                </li>
                                <li className={styles["detail-view__strong"]}>
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        판매가
                                    </span>
                                    <div>
                                        {price &&
                                            Number(price).toLocaleString()}{" "}
                                        원
                                    </div>
                                </li>
                                <li>
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        구성
                                    </span>
                                    <div>{config}</div>
                                </li>
                                <li>
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        배송방법
                                    </span>
                                    <div>{deliveryType}</div>
                                </li>
                                <li>
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        배송비
                                    </span>
                                    <div>{deliveryCharge}</div>
                                </li>
                            </ul>
                        </div>

                        {options.map((option, index) => {
                            const key = Object.keys(option)[0];

                            if (!option[key]) {
                                return null;
                            }

                            return (
                                <div
                                    key={key}
                                    className={styles["detail-view__option"]}
                                >
                                    <div
                                        className={
                                            styles["detail-view__selectbox"]
                                        }
                                    >
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            {option[key].title}
                                        </span>
                                        <select
                                            name={key}
                                            // onChange={(e) => {
                                            //     const value = JSON.parse(
                                            //         e.target.value
                                            //     );
                                            //     const selectedOptionValueId =
                                            //         JSON.parse(
                                            //             e.target.value
                                            //         ).id;
                                            //     handleOptionSelect(
                                            //         value,
                                            //         selectedOptionValueId
                                            //     );
                                            //     e.target.value = "";
                                            // }}
                                            key={option[key].title}
                                            value={selectedOptionId}
                                            onChange={handleSelectChange}
                                        >
                                            <option value="">
                                                - [선택] 옵션을 선택해 주세요 -
                                            </option>
                                            {option[key].data.map(
                                                (optionValue) => (
                                                    <option
                                                        value={optionValue.id}
                                                        key={optionValue.id}
                                                    >
                                                        {optionValue.label} (
                                                        {optionValue.price} 원)
                                                    </option>
                                                )
                                            )}
                                        </select>
                                    </div>
                                </div>
                            );
                        })}

                        <div className={styles["detail-view__caution"]}>
                            <span>(최소주문수량 1개 이상)</span>
                        </div>
                        {selectedOptions.length > 0 &&
                            selectedOptions.map((option, index) => {
                                const displayPrice =
                                    (Number(price) +
                                        (Number(option.value.price) || 0)) *
                                    Number(option.value.quantity);
                                return (
                                    <div
                                        key={`${index}-${option.key}`}
                                        className={styles["detail-view__calc"]}
                                    >
                                        <div>
                                            <div>{title}</div>
                                            <div>- {option.value.label}</div>
                                        </div>
                                        <div>
                                            <div className="quantity-control">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            option.key,
                                                            -1
                                                        )
                                                    }
                                                >
                                                    -
                                                </button>
                                                <div className="quantity-control__view">
                                                    {option.value.quantity}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        handleQuantityChange(
                                                            option.key,
                                                            1
                                                        )
                                                    }
                                                >
                                                    +
                                                </button>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleDeleteOption(
                                                        option.key
                                                    )
                                                }
                                            >
                                                삭제
                                            </button>
                                        </div>
                                        <div>
                                            {displayPrice.toLocaleString()} 원
                                        </div>
                                    </div>
                                );
                            })}

                        <div className={styles["detail-view__total"]}>
                            <div className={styles["detail-view__row"]}>
                                <div
                                    className={styles["detail-view__quantity"]}
                                >
                                    TOTAL<span> (QUANTITY)</span>
                                </div>
                                <div className={styles["detail-view__result"]}>
                                    <strong>
                                        {totalPrice.toLocaleString()}
                                    </strong>
                                    <span>
                                        <span className="detail-view__num">
                                            {selectedOptions.reduce(
                                                (sum, option) =>
                                                    sum + option.value.quantity,
                                                0
                                            )}
                                        </span>{" "}
                                        개
                                    </span>
                                </div>
                            </div>
                            <div className={styles["detail-view__row"]}>
                                <div
                                    className={styles["detail-view__delivery"]}
                                >
                                    <span
                                        className={styles["detail-view__tit"]}
                                    >
                                        배송정보
                                    </span>
                                    <div>
                                        <ul>
                                            <li>다노배송(새벽/택배)</li>
                                            <li>
                                                새벽배송 : 지금 주문하면{" "}
                                                <strong>
                                                    9월 24일(화) 오전 7시 전
                                                </strong>{" "}
                                                도착
                                            </li>
                                            <li>
                                                택배배송 : 지금 주문하면{" "}
                                                <strong>
                                                    9월 23일(월) 출고
                                                </strong>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles["detail-view__button"]}>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-square btn-square--black"
                                    onClick={() => {
                                        handleAddToCart(false);
                                        goToPayment();
                                    }}
                                >
                                    <span className="btn btn-square__text">
                                        구매하기
                                    </span>
                                </button>
                            </div>
                            <div>
                                <button
                                    type="button"
                                    className="btn btn-square"
                                    onClick={() => handleAddToCart(true)}
                                    disabled={isAdding}
                                >
                                    <span className="btn btn-square__text">
                                        장바구니
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-square"
                                    onClick={() => addWishListItem()}
                                >
                                    <span className="btn btn-square__text">
                                        관심상품
                                    </span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles["detail-view__contents"]}>
                    <div className="detail-tab">
                        <ul>
                            <li className="active">
                                <Link>상세정보</Link>
                            </li>
                            <li>
                                <Link>상품후기</Link>
                            </li>
                            <li>
                                <Link>상품문의</Link>
                            </li>
                            <li>
                                <Link>배송/교환/환불 안내</Link>
                            </li>
                        </ul>
                    </div>
                    <div className={styles["detail-view__box"]}>
                        <div className={styles["detail-view__inner"]}>
                            <img
                                src={`/uploads/product/${detail}`}
                                alt={title}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <LayerPopup
                ref={layerPopupRef}
                closeLayerPopup={closeLayerPopup}
                isActive={isPopupActive}
            />
        </SubContentsSmall>
    );
}

export default View;
