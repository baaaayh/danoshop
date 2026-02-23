import React from "react";
import { Link } from "react-router-dom";

function OrderHistory({ orderObj }) {
  return (
    <>
      {orderObj ? (
        <div className="order-history">
          <ul className="order-history__list">
            {orderObj.map((order) => {
              return (
                <li key={order.orderId}>
                  <ul>
                    <li
                      className="order-history__product"
                      key={`${order.orderId}`}
                    >
                      <div className="order-history__id">
                        <span>
                          <strong>{order.orderDate}</strong> ({order.orderId})
                        </span>
                        <Link
                          to={`/mypage/orderDetail/${order.orderId}`}
                          state={{
                            title: ["마이 쇼핑", "주문 상세"],
                          }}
                        >
                          상세보기
                        </Link>
                      </div>
                      {order.items.map((orderItem, index) =>
                        orderItem.options.map((item, index) => (
                          <div key={`${item.id}-${index}`}>
                            <div className="order-history__desc">
                              <div className="order-history__figure">
                                <Link
                                  to={`/product/detail/all/${orderItem.data.type}/${orderItem.data.id}`}
                                >
                                  <img
                                    src={`/uploads/product/${orderItem.data.thumb}`}
                                    alt=""
                                  />
                                </Link>
                              </div>
                              <div className="order-history__info">
                                <strong>{orderItem.data.title}</strong>
                                <p>
                                  {(
                                    Number(orderItem.data.price) +
                                    Number(item.value.price)
                                  ).toLocaleString()}
                                  원 ({item.value.quantity}
                                  개)
                                </p>
                                <p>옵션 : [{item.value.label}]</p>
                              </div>
                            </div>
                          </div>
                        )),
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
                                    배송조회
                                  </span>
                                </button>
                              </li>
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
                        <div className="order-history__total">
                          <div className="pcv">
                            상품구매금액 {order.totalPrice.toLocaleString()} +
                            3,500 = 총 결제금액{" "}
                            {(Number(order.totalPrice) + 3500).toLocaleString()}{" "}
                            원
                          </div>
                          <div className="mov">
                            <div className="order-history__row">
                              <span>총 결제금액</span>
                              <strong>
                                {(
                                  Number(order.totalPrice) + 3500
                                ).toLocaleString()}
                                원
                              </strong>
                            </div>
                            <div className="order-history__row">
                              <small>
                                상품구매금액 {order.totalPrice.toLocaleString()}{" "}
                                + 3,500 = 총 결제금액{" "}
                                {(
                                  Number(order.totalPrice) + 3500
                                ).toLocaleString()}{" "}
                              </small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  </ul>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <p className="mypage-box__noitem">
          <img src="/images/icons/icon_no_item.svg" alt="" />
          주문 내역이 없습니다.
        </p>
      )}
    </>
  );
}

export default OrderHistory;
