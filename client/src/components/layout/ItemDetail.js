import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ItemDetail.module.scss";

function ItemDetail({ itemValue, handleCheckbox, checkedOptions, removeItem }) {
    const [itemKey, setItemKey] = useState("");

    useEffect(() => {
        if (itemValue.wishOption) {
            setItemKey(itemValue.wishOption.value.id);
        } else {
            setItemKey(itemValue.id);
        }
    }, []);

    return (
        <li className={styles["item-row"]}>
            <div className={styles["item-row__container"]}>
                <div className={styles["item-row__chk"]}>
                    <input
                        type="checkbox"
                        checked={checkedOptions[itemKey] || false}
                        value={itemKey}
                        onChange={() => handleCheckbox(itemValue.id, itemKey)}
                    />
                </div>
                <div className={styles["item-row__info"]}>
                    <div className={styles["item-row__detail"]}>
                        <div className={styles["item-row__thumb"]}>
                            <Link
                                to={`/product/detail/all/${itemValue.type}/${itemValue.id}`}
                            >
                                <img
                                    src={`/uploads/product/${itemValue.thumb}`}
                                    alt=""
                                />
                            </Link>
                        </div>
                        <div className={styles["item-row__text"]}>
                            <>
                                <div>{itemValue.title}</div>
                                <div>{`${Number(
                                    itemValue.price
                                ).toLocaleString()} 원`}</div>
                                {itemValue.wishOption && (
                                    <div>
                                        옵션: {itemValue.wishOption.value.label}
                                    </div>
                                )}
                            </>
                        </div>
                    </div>
                </div>
                <button
                    type="button"
                    className="btn btn-remove"
                    onClick={() => removeItem(itemKey)}
                >
                    삭제
                </button>
            </div>
        </li>
    );
}

export default ItemDetail;
