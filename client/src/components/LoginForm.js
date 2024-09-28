import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, updateCartItem, clearCart } from "../modules/cartList";
import { saveToken } from "../modules/userData";
import axios from "axios";
import styles from "./LoginForm.module.scss";

function LoginForm() {
    const [loginData, setLoginData] = useState({
        id: "",
        password: "",
    });
    const [updatedLocalCart, setUpdatedLocalCart] = useState();
    const [validUser, setValidUser] = useState(""); // 초기값 true로 설정
    const dispatch = useDispatch();
    const localCart = useSelector((state) => state.cart.cartList);
    const userInfo = useSelector((state) => state.user);
    const isLoggedIn = useSelector((state) => state.user.token);
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

        if (!loginData.id || !loginData.password) {
            setValidUser("아이디 또는 비밀번호를 입력해 주세요.");
            return;
        }

        if (isLoggedIn) {
            setValidUser("이미 로그인 되었습니다.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:4000/api/login",
                loginData
            );

            setValidUser(response.data.msg);

            dispatch(
                saveToken({ token: response.data.token, userId: loginData.id })
            );

            if (response.data.success) {
                // 로그인 성공 시 로컬 카트를 서버로 전송하여 동기화
                const resCartData = await axios.post(
                    "http://localhost:4000/api/userCart",
                    {
                        loginData: { id: response.data.user.userId },
                        localCart: localCart, // 현재 로컬 카트를 서버로 전송
                    }
                );

                // 서버에서 받은 카트 데이터를 Redux 상태에 업데이트
                dispatch(clearCart());
                resCartData.data.cart.forEach((item) => {
                    dispatch(addCartItem(item));
                });
            }
            navigate("/");
        } catch (error) {
            console.error(error);
            setValidUser(false);
        }
    }

    useEffect(() => {
        if (isLoggedIn) {
            const fetchCartData = async () => {
                try {
                    // 서버에서 데이터를 다시 불러오기
                    const response = await axios.post(
                        "http://localhost:4000/api/userCart",
                        { loginData: { id: userInfo.userId }, localCart: [] }
                    );

                    // 서버로부터 받은 장바구니 데이터를 로컬 상태로 설정
                    if (response.data) {
                        dispatch(clearCart()); // 기존 로컬 카트 초기화
                        response.data.cart.forEach((item) =>
                            dispatch(addCartItem(item))
                        ); // 서버 데이터로 스토어 업데이트
                    }
                } catch (error) {
                    console.error("Failed to fetch cart data:", error);
                }
            };

            fetchCartData();
        }
    }, [isLoggedIn, dispatch]);

    return (
        <div className={styles["login"]}>
            ID : user1 / PW : 1234
            <div
                className={`${styles["login__row"]} ${styles["login__row--input"]}`}
            >
                <input
                    type="text"
                    placeholder="아이디"
                    name="id"
                    value={loginData.id}
                    onChange={onChange}
                />
                <input
                    type="password"
                    placeholder="비밀번호"
                    name="password"
                    value={loginData.password}
                    onChange={onChange}
                />
            </div>
            <div className={`${styles["login__row"]}`}>{validUser}</div>
            <div className={`${styles["login__row"]}`}>
                <button
                    type="submit"
                    className="btn btn-square btn-square--black"
                    onClick={submitLoginData}
                >
                    <span className="btn-square__text">로그인</span>
                </button>
            </div>
            <div
                className={`${styles["login__row"]} ${styles["login__row--find"]}`}
            >
                <ul>
                    <li>
                        <Link to="">아이디 찾기</Link>
                    </li>
                    <li>
                        <Link to="">비밀번호 찾기</Link>
                    </li>
                </ul>
            </div>
            <div
                className={`${styles["login__row"]} ${styles["login__row--join"]}`}
            >
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
