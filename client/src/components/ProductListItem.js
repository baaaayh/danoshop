import { useState, useEffect } from "react";
import { Link, useParams, useLocation } from "react-router-dom";
import styles from "./ProductListItem.module.scss";

function ProductListItem({ productList = [], type }) {
    const { category, type: paramType } = useParams();
    const { pathname } = useLocation();
    const [list, setList] = useState([]);

    useEffect(() => {
        if (productList.length === 0) return;

        let filteredList = productList;

        if (pathname === "/") {
            filteredList = filteredList.filter(
                (item) => item.type === type && item.mainExpose === "true"
            );
        } else if (category !== "all") {
            if (paramType === undefined) {
                filteredList = filteredList.filter(
                    (item) => item.category === category
                );
            } else {
                filteredList = filteredList.filter(
                    (item) => item.type === paramType
                );
            }
        }

        setList(filteredList);
    }, [productList, type, paramType, pathname, category]);

    return (
        <>
            {list.map((item) => (
                <li className={styles.product__item} key={item.id}>
                    <Link
                        to={`/product/detail/${item.id}`}
                        className={styles.product__inner}
                    >
                        <div className={styles.product__figure}>
                            <img
                                src={`/uploads/product/${item.thumb}`}
                                alt={item.title}
                            />
                        </div>
                        <div className={styles.product__desc}>
                            <h3 className={styles.product__title}>
                                {item.title}
                            </h3>
                            <div className={styles.product__config}>
                                <h4>구성 :</h4>
                                <span className={styles.product__num}>
                                    {item.config}
                                </span>
                            </div>
                        </div>
                        <div className={styles.product__desc}>
                            <h4 className={styles.product__selling}>판매가</h4>
                            <strong>
                                <span className={styles.product__price}>
                                    {item.price
                                        .toLocaleString()
                                        .replace(
                                            /\B(?=(\d{3})+(?!\d))/g,
                                            ","
                                        )}{" "}
                                    원
                                </span>
                            </strong>
                        </div>
                        <div className={styles.product__icon}>
                            <span>품절</span>
                        </div>
                    </Link>
                </li>
            ))}
        </>
    );
}

export default ProductListItem;
