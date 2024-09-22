import React from "react";
import SubContentsSmall from "../../components/SubContentsSmall";
import styles from "./Cart.module.scss";

function Cart() {
    return (
        <SubContentsSmall>
            <div className="cart">
                <div className={styles["cart__view"]}></div>
                <div className={styles["cart__right"]}>
                    <div className={styles["cart__total"]}>
                        <ul>
                            <li>
                                <span>총 상품금액</span>
                                <div></div>
                            </li>
                            <li>
                                <span>총 배송비</span>
                                <div></div>
                            </li>
                        </ul>
                        <div>
                            <b>결제예정금액</b>
                            <div>
                                <strong></strong>
                                <span>원</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles["cart__button"]}>
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    className="btn btn-square btn-square--black"
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
                                >
                                    <span className="btn-square__text">
                                        전체상품주문
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </SubContentsSmall>
    );
}

export default Cart;
