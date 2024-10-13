import React, { useState, useEffect } from "react";

function JoinForm() {
    const [inputValue, setInputValue] = useState({
        userId: "",
        password: "",
        passwordConfirm: "",
        userName: "",
        phone: "",
        email: "",
        recommand: "",
    });

    const handleInput = (e) => {
        setInputValue({
            [e.target.name]: e.target.value,
        });
    };

    return (
        <div className="join">
            <div className="join__inner">
                <div className="join__row">
                    <div className="join__title">
                        <h3>회원인증</h3>
                        <div className="join__box">
                            <div className="table-container">
                                <table>
                                    <colgroup>
                                        <col style={{ width: "190px" }} />
                                        <col style={{ width: "auto" }} />
                                    </colgroup>
                                    <tbody>
                                        <tr>
                                            <th>
                                                <span className="star"></span>
                                                회원구분
                                            </th>
                                            <td>
                                                <span className="radio-group">
                                                    <input
                                                        type="radio"
                                                        id="memberType"
                                                        checked="true"
                                                    />
                                                    <label htmlFor="memberType">
                                                        개인회원
                                                    </label>
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="join__row">
                    <div className="join__title">
                        <h3>기본정보</h3>
                    </div>
                    <div className="join__box">
                        <div className="table-container">
                            <table>
                                <colgroup>
                                    <col style={{ width: "190px" }} />
                                    <col style={{ width: "auto" }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            아이디
                                        </th>
                                        <td>
                                            <input
                                                type="text"
                                                value={inputValue.userId}
                                                onChange={handleInput}
                                            />
                                            <p>
                                                (영문 대소문자/숫자/특수문자 중
                                                2가지 이상 조합, 10자~16자)
                                            </p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            비밀번호
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                value={inputValue.password}
                                                onChange={handleInput}
                                            />
                                            <p>(영문소문자/숫자, 4~16자)</p>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            비밀번호 확인
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                value={
                                                    inputValue.passwordConfirm
                                                }
                                                onChange={handleInput}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            이름
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                value={inputValue.userName}
                                                onChange={handleInput}
                                            />
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            휴대전화
                                        </th>
                                        <td>
                                            <div className="phone-form">
                                                <input
                                                    type="password"
                                                    value={inputValue.phone1}
                                                    onChange={handleInput}
                                                />
                                                -
                                                <input
                                                    type="password"
                                                    value={inputValue.phone1}
                                                    onChange={handleInput}
                                                />
                                                -
                                                <input
                                                    type="password"
                                                    value={inputValue.phone1}
                                                    onChange={handleInput}
                                                />
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            이메일
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                value={inputValue.email}
                                                onChange={handleInput}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="join__row">
                    <div className="join__title">
                        <h3>추가정보 (선택)</h3>
                    </div>
                    <div className="join__box">
                        <div className="table-container">
                            <table>
                                <colgroup>
                                    <col style={{ width: "190px" }} />
                                    <col style={{ width: "auto" }} />
                                </colgroup>
                                <tbody>
                                    <tr>
                                        <th>생년월일</th>
                                        <td>
                                            <div className="birth-form">
                                                <ul>
                                                    <li>
                                                        <input
                                                            type="password"
                                                            value={
                                                                inputValue.birthYear
                                                            }
                                                            onChange={
                                                                handleInput
                                                            }
                                                        />
                                                        년
                                                    </li>
                                                    <li>
                                                        <input
                                                            type="password"
                                                            value={
                                                                inputValue.birthMonth
                                                            }
                                                            onChange={
                                                                handleInput
                                                            }
                                                        />
                                                        월
                                                    </li>
                                                    <li>
                                                        <input
                                                            type="password"
                                                            value={
                                                                inputValue.birthDay
                                                            }
                                                            onChange={
                                                                handleInput
                                                            }
                                                        />
                                                        일
                                                    </li>
                                                </ul>
                                                <div className="birth-form__radio">
                                                    <span className="radio-group">
                                                        <input
                                                            type="radio"
                                                            id="birthType1"
                                                        />
                                                        <label htmlFor="birthType1">
                                                            양력
                                                        </label>
                                                    </span>
                                                    <span className="radio-group">
                                                        <input
                                                            type="radio"
                                                            id="birthType2"
                                                        />
                                                        <label htmlFor="birthType2">
                                                            음력
                                                        </label>
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>추천인 아이디</th>
                                        <td>
                                            <input
                                                type="password"
                                                value={inputValue.recommand}
                                                onChange={handleInput}
                                            />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default JoinForm;
