import { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function OrderDetail() {
    const toggleBoxes = useRef([]);
    const params = useParams();
    const userInfo = useSelector((state) => state.user);
    const { orderId } = params;
    const [orderObj, serOrderObj] = useState({});
    const [totalQuantity, setTotalQuantity] = useState(0);

    const fetchOrder = useCallback(async () => {
        try {
            if (userInfo.token) {
                const response = await axios.post(
                    "http://baaaayh.sytes.net/api/getOrderHistory",
                    {
                        userId: userInfo.userId,
                        orderId,
                    }
                );
                const [order] = response.data.orderObj;
                serOrderObj(order);
            }
        } catch (error) {
            console.error(error);
        }
    }, [userInfo.token, userInfo.userId, orderId]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    useEffect(() => {
        toggleBoxes.current.forEach((button) => {
            button.addEventListener("click", (e) => {
                const box = e.target.closest(".order-detail__box");
                box.classList.toggle("hidden");
            });
        });
    }, []);

    useEffect(() => {
        const totalQnt = orderObj?.items?.reduce((acc, item) => {
            return (
                acc +
                item?.options?.reduce((optionAcc, option) => {
                    return optionAcc + Number(option.value.quantity);
                }, 0)
            );
        }, 0);
        setTotalQuantity(totalQnt);
    }, [orderObj]);

    return (
        <div className="order-detail">
            <div className="order-detail__box">
                <button ref={(el) => (toggleBoxes.current[0] = el)}>
                    <strong>주문정보</strong>
                </button>
                <div className="order-detail__content">
                    <div className="order-detail__toggle">
                        <table>
                            <caption></caption>
                            <colgroup>
                                <col style={{ width: "190px" }} />
                                <col style={{ width: "auto" }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>주문번호</th>
                                    <td>{orderObj?.orderId}</td>
                                </tr>
                                <tr>
                                    <th>주문일자</th>
                                    <td>{orderObj?.orderDate}</td>
                                </tr>
                                <tr>
                                    <th>주문자</th>
                                    <td>{orderObj?.userInfo?.addressee}</td>
                                </tr>
                                <tr>
                                    <th>주문처리상태</th>
                                    <td>배송완료</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="order-detail__box">
                <button ref={(el) => (toggleBoxes.current[1] = el)}>
                    <strong>결제정보</strong>
                </button>
                <div className="order-detail__content">
                    <div className="order-detail__toggle">
                        <table>
                            <caption></caption>
                            <colgroup>
                                <col style={{ width: "190px" }} />
                                <col style={{ width: "auto" }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>총 주문금액</th>
                                    <td>
                                        <strong>
                                            {(
                                                orderObj?.totalPrice + 3500
                                            ).toLocaleString()}
                                        </strong>
                                        원
                                    </td>
                                </tr>
                                <tr>
                                    <th>총 결제금액</th>
                                    <td>
                                        <strong>
                                            {(
                                                orderObj?.totalPrice + 3500
                                            ).toLocaleString()}
                                        </strong>
                                        원
                                    </td>
                                </tr>
                                <tr>
                                    <th>결제수단</th>
                                    <td>{orderObj?.selectedPayment}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="order-detail__box">
                <button ref={(el) => (toggleBoxes.current[2] = el)}>
                    <strong>
                        주문 상품 정보
                        <span>
                            (총 {totalQuantity}개 /{" "}
                            {(orderObj?.totalPrice + 3500).toLocaleString()}
                            원)
                        </span>
                    </strong>
                </button>
                <div className="order-detail__content">
                    <div className="order-detail__toggle">
                        {orderObj?.items?.map((orderItem, index) =>
                            orderItem?.options?.map((item, index) => (
                                <div key={`${item.id}-${index}`}>
                                    <div className="order-history__desc">
                                        <div className="order-history__figure">
                                            <img
                                                src={`/uploads/product/${orderItem.data.thumb}`}
                                                alt=""
                                            />
                                        </div>
                                        <div className="order-history__info">
                                            <strong>
                                                {orderItem.data.title}
                                            </strong>
                                            <p>
                                                {(
                                                    Number(
                                                        orderItem.data.price
                                                    ) + Number(item.value.price)
                                                ).toLocaleString()}
                                                원 ({item.value.quantity}
                                                개)
                                            </p>
                                            <p>옵션 : [{item.value.label}]</p>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                        <div className="order-history__bottom">
                            <div className="order-history__result">
                                <strong>배송완료</strong>
                                <div className="order-history__button">
                                    <ul>
                                        <li>
                                            <button
                                                type="button"
                                                className="btn btn-square btn-square--white"
                                            >
                                                <span className="btn btn-square__text">
                                                    구매후기
                                                </span>
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="order-history__foot">
                            <ul>
                                <li>[기본배송]</li>
                                <li>
                                    상품구매금액{" "}
                                    {orderObj?.totalPrice?.toLocaleString()} +
                                    배송비 : 3,500
                                </li>
                                <li>
                                    합계 :{" "}
                                    <strong>
                                        {(
                                            Number(orderObj?.totalPrice) + 3500
                                        ).toLocaleString()}{" "}
                                    </strong>
                                    원
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="order-detail__box">
                <button ref={(el) => (toggleBoxes.current[3] = el)}>
                    <strong>배송지정보</strong>
                </button>
                <div className="order-detail__content">
                    <div className="order-detail__toggle">
                        <table>
                            <caption></caption>
                            <colgroup>
                                <col style={{ width: "190px" }} />
                                <col style={{ width: "auto" }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>받으시는분</th>
                                    <td>{orderObj?.userInfo?.addressee}</td>
                                </tr>
                                <tr>
                                    <th>우편번호</th>
                                    <td>{orderObj?.userInfo?.zoneCode}</td>
                                </tr>
                                <tr>
                                    <th>주소</th>
                                    <td>
                                        {orderObj?.userInfo?.defaultAddress +
                                            orderObj?.userInfo?.subAddress}
                                    </td>
                                </tr>
                                <tr>
                                    <th>일반전화</th>
                                    <td></td>
                                </tr>
                                <tr>
                                    <th>휴대전화</th>
                                    <td>
                                        {String(orderObj?.userInfo?.phone1) +
                                            "-" +
                                            String(orderObj?.userInfo?.phone2) +
                                            "-" +
                                            String(orderObj?.userInfo?.phone3)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div className="order-detail__box">
                <button ref={(el) => (toggleBoxes.current[4] = el)}>
                    <strong>추가정보</strong>
                </button>
                <div className="order-detail__content">
                    <div className="order-detail__toggle">
                        <table>
                            <caption></caption>
                            <colgroup>
                                <col style={{ width: "190px" }} />
                                <col style={{ width: "auto" }} />
                            </colgroup>
                            <tbody>
                                <tr>
                                    <th>새벽배송 출입정보</th>
                                    <td>{orderObj.deliveryMsg}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default OrderDetail;
