import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addCartItem, updateCartItem, clearCart } from '../modules/cartList';
import { saveToken } from '../modules/userData';
import axios from 'axios';
import styles from './LoginForm.module.scss';

function LoginForm() {
    const [loginData, setLoginData] = useState({
        id: '',
        password: '',
    });
    const [validUser, setValidUser] = useState(true); // 초기값 true로 설정
    const dispatch = useDispatch();
    const localCart = useSelector((state) => state.cart.cartList);
    const navigate = useNavigate();

    function onChange(event) {
        const { name, value } = event.target;
        setLoginData((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    async function submitLoginData(event) {
        event.preventDefault();

        // 입력 검증
        if (!loginData.id || !loginData.password) {
            setValidUser(false);
            return;
        }

        try {
            const response = await axios.post('http://localhost:4000/api/login', loginData);
            console.log(loginData);
            dispatch(saveToken({ token: response.data.token, userId: loginData.id }));

            // 로그인 성공 후 장바구니 동기화
            const resCartData = await axios.post('http://localhost:4000/api/userCart', {
                loginData: { id: loginData.id },
                localCart,
            });

            if (resCartData.data.cart) {
                dispatch(clearCart()); // 로컬 장바구니 비우기
                resCartData.data.cart.forEach((item) => dispatch(addCartItem(item))); // 서버의 장바구니 데이터로 업데이트
            } else {
                response.data.user.cart.forEach((item) => dispatch(addCartItem(item))); // 서버의 장바구니를 그대로 저장
            }

            navigate('/'); // 로그인 성공 후 리디렉션
        } catch (error) {
            console.error(error);
            setValidUser(false); // 에러 발생 시 validUser false로 설정
        }
    }

    return (
        <div className={styles['login']}>
            <div className={`${styles['login__row']} ${styles['login__row--input']}`}>
                <input type="text" placeholder="아이디" name="id" value={loginData.id} onChange={onChange} />
                <input type="password" placeholder="비밀번호" name="password" value={loginData.password} onChange={onChange} />
            </div>
            <div className={`${styles['login__row']}`}>{!validUser && <p>아이디 혹은 비밀번호가 일치하지 않습니다.</p>}</div>
            <div className={`${styles['login__row']}`}>
                <button type="submit" className="btn btn-square btn-square--black" onClick={submitLoginData}>
                    <span className="btn-square__text">로그인</span>
                </button>
            </div>
            <div className={`${styles['login__row']} ${styles['login__row--find']}`}>
                <ul>
                    <li>
                        <Link to="">아이디 찾기</Link>
                    </li>
                    <li>
                        <Link to="">비밀번호 찾기</Link>
                    </li>
                </ul>
            </div>
            <div className={`${styles['login__row']} ${styles['login__row--join']}`}>
                <strong>아직 회원이 아니신가요?</strong>
                <p>지금 회원가입을 하시면 다양한 혜택이 준비되어 있습니다.</p>
                <div>
                    <Link to="/user/join" className="btn btn-square">
                        <span className="btn-square__text">회원가입</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;
