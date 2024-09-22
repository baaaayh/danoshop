import React, { forwardRef } from "react";
import { Link } from "react-router-dom";
import styles from "./LayerPopup.module.scss";

const LayerPopup = forwardRef(({ closeLayerPopup, isActive }, ref) => {
    return (
        <div
            className={`${styles["layer-popup"]} ${
                isActive ? styles.active : ""
            }`}
            ref={ref}
        >
            <div className={styles["layer-popup__head"]}>
                <button type="button" onClick={closeLayerPopup}>
                    닫기
                </button>
            </div>
            <div className={styles["layer-popup__para"]}>
                장바구니에 상품이
                <br />
                정상적으로 담겼습니다.
            </div>
            <div className={styles["layer-popup__button"]}>
                <button
                    type="button"
                    className="btn btn-square"
                    onClick={closeLayerPopup}
                >
                    <span className="btn-square__text">계속 쇼핑하기</span>
                </button>
                <Link
                    to="/order/cart"
                    className="btn btn-square btn-square--black"
                >
                    <span className="btn-square__text">장바구니 이동</span>
                </Link>
            </div>
        </div>
    );
});

export default LayerPopup;
