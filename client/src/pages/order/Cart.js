import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { updateCartItem } from '../../modules/cartList';
import SubContentsSmall from '../../components/SubContentsSmall';
import BreadCrumb from '../../components/BreadCrumb';
import SubTitle from '../../components/SubTitle';
import styles from './Cart.module.scss';

function Cart() {
    const [cartList, setCartList] = useState([]);
    const [totalQuantity, setTotalQuantity] = useState(0);
    const cartData = useSelector((state) => state.cart.cartList);
    const params = useParams();
    const location = useLocation();
    const title = location.state?.title || ['전상품'];
    const dispatch = useDispatch();

    useEffect(() => {
        setCartList(cartData);
    }, [cartData]);

    useEffect(() => {
        const totalQuantity = cartList.reduce((acc, item) => {
            return (
                acc +
                item.options.reduce((optAcc, option) => {
                    return optAcc + (option.value.quantity || 0);
                }, 0)
            );
        }, 0);
        setTotalQuantity(totalQuantity);
    }, [cartList]);

    const handleQuantityChange = (itemId, optionKey, change) => {
        const currentOption = cartList.find((item) => item.id === itemId).options.find((option) => option.key === optionKey);
        const newQuantity = Math.max(currentOption.value.quantity + change, 1);
        dispatch(updateCartItem({ itemId, optionKey, quantity: newQuantity })); // 액션 디스패치
    };

    // 총 상품 금액 계산
    const totalPrice = cartList.reduce((acc, item) => {
        return (
            acc +
            item.options.reduce((itemAcc, option) => {
                return itemAcc + (Number(item.price) + Number(option.value.price)) * option.value.quantity;
            }, 0)
        );
    }, 0);

    // 총 배송비 계산
    const totalDeliveryCharge = cartList.reduce((acc, item) => {
        return acc + item.data.deliveryCharge; // 각 상품의 배송비 합산
    }, 0);

    return (
        <SubContentsSmall>
            <BreadCrumb title={title} path={params} />
            <SubTitle title={title} />
            <div className={styles['step']}>
                <ol>
                    <li>1. 장바구니</li>
                    <li>2. 주문서작성</li>
                    <li>3. 주문완료</li>
                </ol>
            </div>
            <div className={styles['cart']}>
                <div className={styles['cart__view']}>
                    <div className={styles['cart__title']}>
                        <h2>장바구니 상품</h2>
                    </div>
                    <div className={styles['cart__contents']}>
                        <div className={styles['cart__type']}>일반상품 ({totalQuantity})</div>
                        <div className={styles['cart__list']}>
                            <ul>
                                {cartList.map((item) =>
                                    item.options.map((option, index) => (
                                        <li className={styles['cart__item']} key={`${item.id}-${index}`}>
                                            <div className={styles['cart__chk']}>
                                                <input type="checkbox" />
                                            </div>
                                            <div className={styles['cart__info']}>
                                                <div className={styles['cart__detail']}>
                                                    <div className={styles['cart__thumb']}>
                                                        <img src={`/uploads/product/${item.data.thumb}`} alt="" />
                                                    </div>
                                                    <div className={styles['cart__text']}>
                                                        <div>{item.data.title}</div>
                                                        <div>{`${Number(option.value.price).toLocaleString()} 원`}</div>
                                                        <div>배송: {`${item.data.deliveryCharge} / ${item.data.deliveryType}`}</div>
                                                    </div>
                                                </div>
                                                <div className={styles['cart__option']}>
                                                    <p>{option.value.label}</p>
                                                </div>
                                                <div className={styles['cart__quantity']}>
                                                    <span>수량</span>
                                                    <div>
                                                        <div className="quantity-control">
                                                            <button type="button" onClick={() => handleQuantityChange(item.id, option.key, -1)}>
                                                                -
                                                            </button>
                                                            <div className="quantity-control__view">{option.value.quantity}</div>
                                                            <button type="button" onClick={() => handleQuantityChange(item.id, option.key, 1)}>
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className={styles['cart__price']}>
                                                    <span>주문금액</span>
                                                    <div>
                                                        <strong>{`${((Number(item.price) + Number(option.value.price)) * option.value.quantity).toLocaleString()}`}</strong> 원
                                                    </div>
                                                </div>
                                                <div className={styles['cart__button']}>
                                                    <button type="button" className="btn btn-square">
                                                        <span className="btn-square__text">관심상품</span>
                                                    </button>
                                                    <button type="button" className="btn btn-square">
                                                        <span className="btn-square__text">주문하기</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </li>
                                    ))
                                )}
                            </ul>
                        </div>
                    </div>
                </div>
                <div className={styles['cart__right']}>
                    <div className={styles['cart__calc']}>
                        <ul>
                            <li>
                                <span>총 상품금액</span>
                                <div>{`${totalPrice.toLocaleString()} 원`}</div>
                            </li>
                            <li>
                                <span>총 배송비</span>
                                <div>{`3500 원`}</div>
                            </li>
                        </ul>
                        <div className={styles['cart__total']}>
                            <b>결제예정금액</b>
                            <div>
                                <strong>{`${(Number(totalPrice) + 3500).toLocaleString()}`}</strong>
                                <span>원</span>
                            </div>
                        </div>
                    </div>
                    <div className={styles['cart__order']}>
                        <ul>
                            <li>
                                <button type="button" className="btn btn-square btn-square--black">
                                    <span className="btn-square__text">전체상품주문</span>
                                </button>
                            </li>
                            <li>
                                <button type="button" className="btn btn-square">
                                    <span className="btn-square__text">전체상품주문</span>
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
