import React, { useContext, useState, useEffect } from "react";
import { SidePanelContext } from "../../App";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import styles from "./ItemDetail.module.scss";
import { addCartItem } from "../../modules/cartList";
import { setSideOrder } from "../../modules/sideOrder";
import axios from "axios";

function ItemDetail({ itemValue, handleCheckbox, checkedOptions, removeItem }) {
    const sidePanel = useContext(SidePanelContext);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [itemKey, setItemKey] = useState("");
    const [selectedOption, setSelectedOption] = useState({});
    const [selectedOptions, setSelectedOptions] = useState([]);

    useEffect(() => {
        if (itemValue?.wishOption?.value) {
            setItemKey(itemValue.wishOption.value.id);
        } else {
            setItemKey(itemValue.id);
        }
    }, [itemValue]);

    const addToState = (itemId, optionKey) => {
        if (!itemValue.wishOption?.value) {
            console.error("옵션이 존재하지 않습니다.");
            return;
        }

        const product = {
            id: itemId,
            options: [
                {
                    ...itemValue.wishOption,
                    value: {
                        ...itemValue.wishOption.value,
                        quantity: 1,
                    },
                },
            ],
            price: itemValue.data.price,
            data: { ...itemValue.data },
        };

        dispatch(addCartItem(product));
        setSelectedOption(product);
    };

    const orderThisItem = (itemId, optionKey) => {
        // addToState(itemId, optionKey);
        // navigate("/order/order", {
        //     state: {
        //         orderList: [selectedOption],
        //     },
        // });
    };

    const addToCart = (itemId, optionKey) => {
        // addToState(itemId, optionKey);

        console.log(selectedOptions);
    };

    const handleOptionSelect = (selectedOptionValue, key) => {
        setSelectedOptions((prev) => {
            const existingOptionIndex = prev.findIndex(
                (option) => option.key === key
            );
            if (existingOptionIndex === -1) {
                return [
                    ...prev,
                    {
                        key: key,
                        value: {
                            ...selectedOptionValue,
                            quantity: 1,
                        },
                    },
                ];
            }
            return prev;
        });
    };

    const callSideOrder = (itemId) => {
        if (sidePanel && sidePanel.current) {
            sidePanel.current.open(itemId);
        } else {
            console.error("sidePanel ref가 설정되지 않았습니다.");
        }
    };

    return (
        <li className={styles["item-row"]}>
            <div className={styles["item-row__container"]}>
                {location.pathname === "/mypage/recentView" ? null : (
                    <div className={styles["item-row__chk"]}>
                        <input
                            type="checkbox"
                            checked={
                                checkedOptions[itemValue.uniqueId] || false
                            }
                            value={itemValue.uniqueId}
                            onChange={() =>
                                handleCheckbox(
                                    itemValue.data.id,
                                    itemValue.uniqueId
                                )
                            }
                        />
                    </div>
                )}
                <div className={styles["item-row__info"]}>
                    <div className={styles["item-row__detail"]}>
                        <div className={styles["item-row__thumb"]}>
                            <Link
                                to={
                                    itemValue.data
                                        ? `/product/detail/all/${itemValue.data.type}/${itemValue.data.id}`
                                        : `/product/detail/all/${itemValue.type}/${itemValue.id}`
                                }
                            >
                                <img
                                    src={
                                        itemValue.data
                                            ? `/uploads/product/${itemValue.data.thumb}`
                                            : `/uploads/product/${itemValue.thumb}`
                                    }
                                    alt={
                                        itemValue.data
                                            ? itemValue.data.title
                                            : itemValue.title
                                    }
                                />
                            </Link>
                        </div>
                        <div className={styles["item-row__text"]}>
                            <div>
                                {itemValue.data
                                    ? itemValue.data.title
                                    : itemValue.title}
                            </div>
                            <div>{`${Number(
                                itemValue.data
                                    ? itemValue.data.price
                                    : itemValue.price
                            ).toLocaleString()} 원`}</div>
                            {itemValue.wishOption && (
                                <div>
                                    옵션: {itemValue.wishOption.value.label}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles["item-row__button"]}>
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    className="btn btn-square btn-square--white"
                                    value={itemKey}
                                    onClick={() => {
                                        // addToCart(
                                        //     itemValue.data
                                        //         ? itemValue.data.id
                                        //         : itemValue.id,
                                        //     itemValue.wishOption?.value?.id
                                        // );
                                        // callSideOrder();
                                    }}
                                >
                                    <span className="btn btn-square__text">
                                        장바구니
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    className="btn btn-square btn-square--black"
                                    value={itemKey}
                                    onClick={() => {
                                        // orderThisItem(
                                        //     itemValue.data
                                        //         ? itemValue.data.id
                                        //         : itemValue.id,
                                        //     itemValue.wishOption?.value?.id
                                        // );
                                        // dispatch(
                                        //     setSideOrder(
                                        //         itemValue.data
                                        //             ? itemValue.data.id
                                        //             : itemValue.id
                                        //     )
                                        // );
                                        callSideOrder(
                                            itemValue.data
                                                ? itemValue.data.id
                                                : itemValue.id
                                        );
                                    }}
                                >
                                    <span className="btn btn-square__text">
                                        주문하기
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-remove"
                    onClick={() => removeItem(itemValue.uniqueId)}
                >
                    삭제
                </button>
            </div>
            {itemValue.id &&
                itemValue.options.map((option, index) => {
                    const key = Object.keys(option)[0];

                    if (!option[key].data) {
                        return null;
                    }

                    return (
                        <div
                            className={styles["item-row__option"]}
                            key={`${key}-${index}`}
                        >
                            <span>옵션</span>
                            <div>
                                <select
                                    name={key}
                                    id=""
                                    onChange={(e) => {
                                        const value = JSON.parse(
                                            e.target.value
                                        );
                                        const selectedOptionValueId =
                                            JSON.parse(e.target.value).id;
                                        handleOptionSelect(
                                            value,
                                            selectedOptionValueId
                                        );
                                    }}
                                >
                                    <option value="">
                                        - [선택] 옵션을 선택해 주세요 -
                                    </option>

                                    {option[key].data?.map((optionValue) => (
                                        <option
                                            value={JSON.stringify(optionValue)}
                                            key={optionValue.id}
                                        >
                                            {optionValue.label} (
                                            {optionValue.price} 원)
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    );
                })}
        </li>
    );
}

export default ItemDetail;
