import { Link } from "react-router-dom";
import SidePanel from "./SidePanel";
import styles from "./ProductListItem.module.scss";

function ProductListItem({ list, title, prevPage }) {
    return (
        <>
            {list.map((item, index) => (
                <li className={styles.product__item} key={item.id}>
                    <div className={styles.product__figure}>
                        <Link
                            to={`/product/detail${
                                prevPage
                                    ? `/${prevPage.category}`
                                    : `/${item.category}`
                            }${
                                prevPage && prevPage.type
                                    ? `/${prevPage.type}`
                                    : `/${item.type}`
                            }/${item.id}`}
                            state={{ title: title }}
                            className={styles.product__inner}
                        >
                            <img
                                src={`/uploads/product/${item.thumb}`}
                                alt={item.title}
                            />
                        </Link>
                        <SidePanel productId={item.id} index={index} />
                    </div>
                    <div className={styles.product__desc}>
                        <Link
                            to={`/product/detail${
                                prevPage
                                    ? `/${prevPage.category}`
                                    : `/${item.category}`
                            }${
                                prevPage && prevPage.type
                                    ? `/${prevPage.type}`
                                    : `/${item.type}`
                            }/${item.id}`}
                            state={{ title: title }}
                            className={styles.product__inner}
                        >
                            <h3 className={styles.product__title}>
                                {item.title}
                            </h3>
                            <div className={styles.product__config}>
                                <h4>구성 :</h4>
                                <span className={styles.product__num}>
                                    {item.config}
                                </span>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.product__desc}>
                        <h4 className={styles.product__selling}>판매가</h4>
                        <strong>
                            <span className={styles.product__price}>
                                {item.price
                                    .toLocaleString()
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}{" "}
                                원
                            </span>
                        </strong>
                    </div>
                    <div className={styles.product__icon}>
                        {item.soldout === "true" ? <span>품절</span> : null}
                    </div>
                </li>
            ))}
        </>
    );
}

export default ProductListItem;
