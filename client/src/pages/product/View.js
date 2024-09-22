import { useState, useEffect } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import SubContentsSmall from "../../components/SubContentsSmall";
import BreadCrumb from "../../components/BreadCrumb";
import styles from "./View.module.scss";

function View() {
    const [selectedOptions, setSelectedOptions] = useState([]); // 선택된 옵션 배열
    const [productInfo, setProductInfo] = useState({});
    const [totalPrice, setTotalPrice] = useState(0);

    const {
        option1,
        option2,
        title,
        summary,
        price,
        config,
        deliveryType,
        deliveryCharge,
        detail,
        view,
    } = productInfo;

    const params = useParams();
    const location = useLocation();
    const productId = params.id;
    const pageTitle = location.state?.title || ["전상품"];

    async function getProductDetail() {
        try {
            const response = await axios.get(
                "http://localhost:4000/api/product",
                {
                    params: { id: productId },
                }
            );
            setProductInfo(response.data[0]);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }

    const handleOptionSelect = (selectedOptionValue) => {
        const existingOptionIndex = selectedOptions.findIndex(
            (option) => option.value.label === selectedOptionValue.label
        );

        if (existingOptionIndex === -1) {
            setSelectedOptions((prev) => [
                ...prev,
                {
                    key: prev.length + 1,
                    value: selectedOptionValue,
                    quantity: 1,
                },
            ]);
        }
    };

    const handleDeleteOption = (key) => {
        setSelectedOptions((prev) =>
            prev.filter((option) => option.key !== key)
        );
    };

    const handleQuantityChange = (key, change) => {
        setSelectedOptions((prev) =>
            prev.map((option) =>
                option.key === key
                    ? {
                          ...option,
                          quantity: Math.max(option.quantity + change, 1),
                      }
                    : option
            )
        );
    };

    useEffect(() => {
        getProductDetail();
    }, []);

    useEffect(() => {
        const newTotalPrice = selectedOptions.reduce((total, option) => {
            const optionPrice = option.value.price || 0;
            return total + (Number(price) + optionPrice) * option.quantity;
        }, 0);
        setTotalPrice(newTotalPrice);
    }, [selectedOptions, price]);

    return (
        <SubContentsSmall>
            <BreadCrumb title={pageTitle} path={params} />
            <div className={styles["detail-view"]}>
                <div className={styles["detail-view__top"]}>
                    <div className={styles["detail-view__figure"]}>
                        <img src={`/uploads/product/${view}`} alt="" />
                    </div>
                    <div className={styles["detail-view__info"]}>
                        <form action="">
                            <div className={styles["detail-view__title"]}>
                                <h2>{title}</h2>
                            </div>
                            <div className={styles["detail-view__list"]}>
                                <ul>
                                    <li>
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            상품요약정보
                                        </span>
                                        <div>{summary}</div>
                                    </li>
                                    <li
                                        className={
                                            styles["detail-view__strong"]
                                        }
                                    >
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            판매가
                                        </span>
                                        <div>
                                            {price &&
                                                Number(price).toLocaleString()}
                                            원
                                        </div>
                                    </li>
                                    <li>
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            구성
                                        </span>
                                        <div>{config}</div>
                                    </li>
                                    <li>
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            배송방법
                                        </span>
                                        <div>{deliveryType}</div>
                                    </li>
                                    <li>
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
                                        >
                                            배송비
                                        </span>
                                        <div>{deliveryCharge}</div>
                                    </li>
                                </ul>
                            </div>

                            {[option1, option2].map((option, index) => {
                                if (
                                    !option ||
                                    !Array.isArray(option.data) ||
                                    option.data.length === 0
                                ) {
                                    return null;
                                }

                                return (
                                    <div
                                        key={index}
                                        className={`${styles["detail-view__option"]}`}
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
                                                {option.title}
                                            </span>
                                            <select
                                                name={`option${index + 1}`}
                                                onChange={(e) => {
                                                    const value = JSON.parse(
                                                        e.target.value
                                                    );
                                                    handleOptionSelect(value);
                                                    e.target.value = ""; // 선택 후 초기화
                                                }}
                                            >
                                                <option value="">
                                                    - [선택] 옵션을 선택해
                                                    주세요 -
                                                </option>
                                                {option.data.map(
                                                    (optionValue) => (
                                                        <option
                                                            value={JSON.stringify(
                                                                optionValue
                                                            )}
                                                            key={
                                                                optionValue.label
                                                            }
                                                        >
                                                            {optionValue.label}{" "}
                                                            ({optionValue.price}{" "}
                                                            원)
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
                            {selectedOptions.map((option) => {
                                const displayPrice =
                                    (Number(price) +
                                        (option.value.price || 0)) *
                                    option.quantity;

                                return (
                                    <div
                                        key={option.key}
                                        className={styles["detail-view__calc"]}
                                    >
                                        <div>
                                            <span>{option.value.label}</span>
                                        </div>
                                        <div>
                                            <div
                                                className={
                                                    styles[
                                                        "detail-view__control"
                                                    ]
                                                }
                                            >
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
                                                <div
                                                    className={
                                                        styles[
                                                            "detail-view__qnum"
                                                        ]
                                                    }
                                                >
                                                    {option.quantity}
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
                                        className={
                                            styles["detail-view__quantity"]
                                        }
                                    >
                                        TOTAL<span> (QUANTITY)</span>
                                    </div>
                                    <div
                                        className={
                                            styles["detail-view__result"]
                                        }
                                    >
                                        <strong>
                                            {totalPrice.toLocaleString()}
                                        </strong>
                                        <span>
                                            <span className="detail-view__num">
                                                {selectedOptions.reduce(
                                                    (sum, option) =>
                                                        sum + option.quantity,
                                                    0
                                                )}
                                            </span>{" "}
                                            개
                                        </span>
                                    </div>
                                </div>
                                <div className={styles["detail-view__row"]}>
                                    <div
                                        className={
                                            styles["detail-view__delivery"]
                                        }
                                    >
                                        <span
                                            className={
                                                styles["detail-view__tit"]
                                            }
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
                                        type="submit"
                                        className="btn btn-square btn-square--black"
                                    >
                                        <span className="btn btn-square__text">
                                            구매하기
                                        </span>
                                    </button>
                                </div>
                                <div>
                                    <button
                                        type="submit"
                                        className="btn btn-square"
                                    >
                                        <span className="btn btn-square__text">
                                            장바구니
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        className="btn btn-square"
                                    >
                                        <span className="btn btn-square__text">
                                            관심상품
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <div className={styles["detail-view__contents"]}>
                    <div className="detail-tab">
                        <ul>
                            <li className="active">
                                <a href="">상세정보</a>
                            </li>
                            <li>
                                <a href="">상품후기</a>
                            </li>
                            <li>
                                <a href="">상품</a>
                            </li>
                            <li>
                                <a href="">상품문의</a>
                            </li>
                            <li>
                                <a href="">배송/교환/환불 안내</a>
                            </li>
                        </ul>
                    </div>
                    <div className={styles["detail-view__box"]}>
                        <div className={styles["detail-view__inner"]}>
                            <img src={`/uploads/product/${detail}`} alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </SubContentsSmall>
    );
}

export default View;
