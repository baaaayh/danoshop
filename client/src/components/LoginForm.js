import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addCartItem, clearCart } from "../modules/cartList";
import { saveToken } from "../modules/userData";
import axios from "axios";
import styles from "./LoginForm.module.scss";

function LoginForm() {
    const [loginData, setLoginData] = useState({ id: "", password: "" });
    const [validUser, setValidUser] = useState("");
    const dispatch = useDispatch();
    const isLoggedIn = useSelector((state) => state.user.token);
    const navigate = useNavigate();

    function onChange(event) {
        const { name, value } = event.target;
        setLoginData((prev) => ({ ...prev, [name]: value }));
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

            if (response.data.success) {
                dispatch(
                    saveToken({
                        token: response.data.token,
                        userId: loginData.id,
                    })
                );
                navigate("/");
            }
        } catch (error) {
            console.error("Login failed:", error);
            setValidUser("로그인 실패. 서버에 문제가 있을 수 있습니다.");
        }
    }

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
