import { useState, useEffect } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import styles from './ProductListItem.module.scss';

function ProductListItem({ productList = [], type, title, prevPage }) {
    const { category, type: paramType } = useParams();

    const { pathname } = useLocation();
    const [list, setList] = useState([]);

    useEffect(() => {
        if (productList.length === 0) return;

        let filteredList = productList;

        if (pathname === '/') {
            filteredList = filteredList.filter((item) => item.type === type && item.mainExpose === 'true');
        } else if (category !== 'all') {
            if (paramType === undefined) {
                filteredList = filteredList.filter((item) => item.category === category);
            } else {
                filteredList = filteredList.filter((item) => item.type === paramType);
            }
        }

        setList(filteredList);
    }, [productList, type, paramType, pathname, category]);

    return (
        <>
            {list.map((item) => (
                <li className={styles.product__item} key={item.id}>
                    <div className={styles.product__figure}>
                        <Link to={`/product/detail${prevPage ? `/${prevPage.category}` : `/${item.category}`}${prevPage && prevPage.type ? `/${prevPage.type}` : `/${item.type}`}/${item.id}`} state={{ title: title }} className={styles.product__inner}>
                            <img src={`/uploads/product/${item.thumb}`} alt={item.title} />
                        </Link>
                    </div>
                    <div className={styles.product__desc}>
                        <Link to={`/product/detail${prevPage ? `/${prevPage.category}` : `/${item.category}`}${prevPage && prevPage.type ? `/${prevPage.type}` : `/${item.type}`}/${item.id}`} state={{ title: title }} className={styles.product__inner}>
                            <h3 className={styles.product__title}>{item.title}</h3>
                            <div className={styles.product__config}>
                                <h4>구성 :</h4>
                                <span className={styles.product__num}>{item.config}</span>
                            </div>
                        </Link>
                    </div>
                    <div className={styles.product__desc}>
                        <h4 className={styles.product__selling}>판매가</h4>
                        <strong>
                            <span className={styles.product__price}>{item.price.toLocaleString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')} 원</span>
                        </strong>
                    </div>
                    <div className={styles.product__icon}>{item.soldout === 'true' ? <span>품절</span> : null}</div>
                </li>
            ))}
        </>
    );
}

export default ProductListItem;
