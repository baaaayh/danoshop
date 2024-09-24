import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveToken } from '../modules/userData';
import axios from 'axios';
import styles from './LoginForm.module.scss';

function LoginForm() {
    const [loginData, setLoginData] = useState({
        id: '',
        password: '',
    });
    const [validUser, setValidUser] = useState();
    const dispatch = useDispatch();
    const loggedIn = useSelector((state) => state.user.state);
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
        try {
            const response = await axios.post('http://localhost:4000/api/login', loginData);
            dispatch(saveToken({ token: response.data.token }));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={styles['login']}>
            ID: user1 / PW: 1234
            <div className={`${styles['login__row']} ${styles['login__row--input']}`}>
                <input type="text" placeholder="아이디" name="id" value={loginData.id} onChange={onChange} />
                <input type="password" placeholder="비밀번호" name="password" value={loginData.password} onChange={onChange} />
            </div>
            <div className={`${styles['login__row']} ${styles['login__row--tar']}`}>
                <label htmlFor="securityLogin">
                    <input type="checkbox" id="securityLogin" />
                    보안접속
                </label>
            </div>
            <div className={`${styles['login__row']}`}>{validUser ? null : <p>아이디 혹은 비밀번호가 일치하지 않습니다.</p>}</div>
            <div className={`${styles['login__row']}`}>
                <button type="submit" className="btn  btn-square btn-square--black" onClick={submitLoginData}>
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
                <p>
                    지금 회원가입을 하시면
                    <br />
                    다양하고 특별한 혜택이 준비되어 있습니다.
                </p>
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
