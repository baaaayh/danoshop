import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function JoinForm({ userInfo }) {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState({});
    const isModifyPage = location.pathname === "/member/modify";
    const [inputValue, setInputValue] = useState({
        joinType: "",
        userId: "",
        password: "",
        passwordConfirm: "",
        userName: "",
        phone1: "",
        phone2: "",
        phone3: "",
        email: "",
        birthYear: "",
        birthMonth: "",
        birthDay: "",
        recommand: "",
    });
    const [birthValue, setBirthValue] = useState("birthType1");
    const [memberTypeValue, setMemberTypeValue] = useState("personal");

    useEffect(() => {
        if (isModifyPage && user) {
            setInputValue({
                joinType: user.joinType || "",
                userId: user.userId || "",
                password: "",
                passwordConfirm: "",
                userName: user.userName || "",
                phone1: user.phone1 || "",
                phone2: user.phone2 || "",
                phone3: user.phone3 || "",
                email: user.email || "",
                birthYear: user.birthYear || "",
                birthMonth: user.birthMonth || "",
                birthDay: user.birthDay || "",
                recommand: user.recommand || "",
            });
        }
    }, [isModifyPage, user]);

    const [checkValidId, setCheckValidId] = useState("");
    const [validPassword, setValidPassword] = useState(false);
    const [validPhoneNumber, setValidPhoneNumber] = useState(false);
    const [validEmail, setValidEmail] = useState(false);

    useEffect(() => {
        if (userInfo) {
            setUser(userInfo);
        }
    }, [userInfo]);

    const handleInput = (e) => {
        setInputValue((prevValue) => ({
            ...prevValue,
            [e.target.name]: e.target.value,
        }));
    };

    useEffect(() => {
        if (!inputValue.userId) {
            setCheckValidId("");
            return;
        }

        const regex = /^[a-z][a-z0-9]{3,}$/;
        const onlyNumbers = /^[0-9]+$/;
        const hasWhitespace = /\s/;

        if (
            !onlyNumbers.test(inputValue.userId) &&
            !hasWhitespace.test(inputValue.userId) &&
            regex.test(inputValue.userId)
        ) {
            const joinDataFetch = async () => {
                const response = await axios.post(
                    "http://localhost:4000/api/checkId",
                    { userId: inputValue.userId }
                );
                setCheckValidId(
                    response.data.checkId
                        ? {
                              class: "red",
                              msg: `${inputValue.userId} 는 사용할 수 없는 아이디입니다.`,
                          }
                        : {
                              class: "blue",
                              msg: `${inputValue.userId} 는 사용 가능한 아이디입니다.`,
                          }
                );
            };
            joinDataFetch();
        } else {
            setCheckValidId({
                class: "red",
                msg: "대문자/공백/특수문자가 포함되었거나, 숫자로 시작 또는 숫자로만 이루어진 아이디는 사용할 수 없습니다.",
            });
        }
    }, [inputValue.userId]);

    const validateForm = () => {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const emailValid = emailRegex.test(inputValue.email);
        if (!emailValid) {
            alert("이메일 형식이 올바르지 않습니다.");
            return false;
        }
        setValidEmail(true);

        // Validate Phone Number
        const phone1Regex = /^(010|011|016|017|018|019)$/; // 한국 휴대전화 앞자리
        const phone2Regex = /^[0-9]{3,4}$/; // 중간 번호는 3자리 또는 4자리
        const phone3Regex = /^[0-9]{4}$/; // 끝 번호는 4자리
        if (!phone1Regex.test(inputValue.phone1)) {
            alert(
                "휴대전화 앞자리는 010, 011, 016, 017, 018, 019 중 하나여야 합니다."
            );
            return false;
        }
        if (!phone2Regex.test(inputValue.phone2)) {
            alert("휴대전화 중간 번호는 3자리 또는 4자리 숫자여야 합니다.");
            return false;
        }
        if (!phone3Regex.test(inputValue.phone3)) {
            alert("휴대전화 끝 번호는 4자리 숫자여야 합니다.");
            return false;
        }
        setValidPhoneNumber(true);

        if ((isModifyPage && inputValue.password) || !isModifyPage) {
            const lengthRegex = /^.{10,16}$/; // 10자 ~ 16자 길이 확인
            const letterRegex = /[a-zA-Z]/; // 영문 대소문자
            const numberRegex = /[0-9]/; // 숫자
            const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/; // 특수문자

            let validCombinations = 0;
            if (letterRegex.test(inputValue.password)) validCombinations += 1;
            if (numberRegex.test(inputValue.password)) validCombinations += 1;
            if (specialCharRegex.test(inputValue.password))
                validCombinations += 1;

            if (!lengthRegex.test(inputValue.password)) {
                alert("비밀번호는 10자에서 16자 사이여야 합니다.");
                return false;
            }
            if (validCombinations < 2) {
                alert(
                    "비밀번호는 영문 대소문자, 숫자, 특수문자 중 2가지 이상 조합이어야 합니다."
                );
                return false;
            }
            if (inputValue.password !== inputValue.passwordConfirm) {
                alert("비밀번호와 비밀번호 확인이 일치하지 않습니다.");
                return false;
            }
            setValidPassword(true);
        } else {
            setValidPassword(true);
        }

        return true;
    };

    const handleSubmit = async (e) => {
        try {
            e.preventDefault();
            if (validateForm()) {
                const userForm = {
                    joinType: inputValue.joinType,
                    userId: inputValue.userId,
                    password: inputValue.password,
                    userName: inputValue.userName,
                    phone: `${inputValue.phone1}${inputValue.phone2}${inputValue.phone3}`,
                    phone1: inputValue.phone1,
                    phone2: inputValue.phone2,
                    phone3: inputValue.phone3,
                    email: inputValue.email,
                    birth: `${inputValue.birthYear}${inputValue.birthMonth}${inputValue.birthDay}`,
                    recommand: inputValue.recommand,
                    grade: "습관성형 비기너",
                };
                const response = await axios.post(
                    "http://localhost:4000/api/join",
                    {
                        userForm: userForm,
                        isModifyMode: isModifyPage ? true : false,
                    }
                );
                if (response.data.success) {
                    if (isModifyPage) {
                        alert("회원 정보 수정이 완료됐습니다.");
                        navigate("/", { state: { title: ["메인"] } });
                    } else {
                        navigate("/member/result", {
                            state: { title: ["회원가입 완료"], info: userForm },
                        });
                    }
                }
            }
        } catch (error) {
            console.error(error);
            alert("오류가 발생했습니다. 메인으로 이동합니다.");
            navigate("/");
        }
    };

    const handleBirthValue = useCallback((e) => {
        setBirthValue(e.target.value);
    }, []);

    const handleMemberType = useCallback((e) => {
        setMemberTypeValue(e.target.id);
    }, []);

    return (
        <div className="join">
            <div className="join__inner">
                {location.pathname === "/member/join" ? (
                    <div className="join__row">
                        <div className="join__title">
                            <h3>회원인증</h3>
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
                                                회원구분
                                            </th>
                                            <td>
                                                <ul className="radio-column">
                                                    <li>
                                                        <span className="radio-group">
                                                            <input
                                                                type="radio"
                                                                id="personal"
                                                                value="personal"
                                                                name="memberType"
                                                                onChange={
                                                                    handleMemberType
                                                                }
                                                                checked={
                                                                    memberTypeValue ===
                                                                    "personal"
                                                                }
                                                            />
                                                            <label htmlFor="personal">
                                                                개인회원
                                                            </label>
                                                        </span>
                                                    </li>
                                                    <li>
                                                        <span className="radio-group">
                                                            <input
                                                                type="radio"
                                                                id="enterprise"
                                                                value="enterprise"
                                                                name="memberType"
                                                                onChange={
                                                                    handleMemberType
                                                                }
                                                                checked={
                                                                    memberTypeValue ===
                                                                    "enterprise"
                                                                }
                                                            />
                                                            <label htmlFor="enterprise">
                                                                기업회원
                                                            </label>
                                                        </span>
                                                    </li>
                                                </ul>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ) : null}

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
                                                name="userId"
                                                value={inputValue.userId}
                                                onChange={handleInput}
                                                readOnly={isModifyPage}
                                            />
                                            <p>(영문소문자/숫자, 4~16자)</p>
                                            {checkValidId && !isModifyPage ? (
                                                <p
                                                    className={
                                                        checkValidId.class
                                                    }
                                                >
                                                    {checkValidId.msg}
                                                </p>
                                            ) : null}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span className="star"></span>
                                            {isModifyPage
                                                ? "새 비밀번호"
                                                : "비밀번호"}
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                name="password"
                                                value={inputValue.password}
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
                                            {isModifyPage
                                                ? "새 비밀번호 확인"
                                                : "비밀번호 확인"}
                                        </th>
                                        <td>
                                            <input
                                                type="password"
                                                name="passwordConfirm"
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
                                                type="text"
                                                name="userName"
                                                value={inputValue.userName}
                                                onChange={handleInput}
                                                readOnly={isModifyPage}
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
                                                    type="text"
                                                    name="phone1"
                                                    value={inputValue.phone1}
                                                    onChange={handleInput}
                                                />
                                                -
                                                <input
                                                    type="text"
                                                    name="phone2"
                                                    value={inputValue.phone2}
                                                    onChange={handleInput}
                                                />
                                                -
                                                <input
                                                    type="text"
                                                    name="phone3"
                                                    value={inputValue.phone3}
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
                                                type="text"
                                                name="email"
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
                                                            name="birthYear"
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
                                                            name="birthMonth"
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
                                                            name="birthDay"
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
                                                            name="birthGroup"
                                                            id="birthType1"
                                                            value={"birthType1"}
                                                            onChange={
                                                                handleBirthValue
                                                            }
                                                            checked={
                                                                birthValue ===
                                                                "birthType1"
                                                            }
                                                        />
                                                        <label htmlFor="birthType1">
                                                            양력
                                                        </label>
                                                    </span>
                                                    <span className="radio-group">
                                                        <input
                                                            type="radio"
                                                            name="birthGroup"
                                                            id="birthType2"
                                                            value={"birthType2"}
                                                            onChange={
                                                                handleBirthValue
                                                            }
                                                            checked={
                                                                birthValue ===
                                                                "birthType2"
                                                            }
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
                <div className="join__row">
                    <div className="join__button">
                        <ul>
                            <li>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    className="btn btn-square btn-square--white"
                                >
                                    <span className="btn btn-square__text">
                                        취소
                                    </span>
                                </button>
                            </li>
                            <li>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="btn btn-square btn-square--black"
                                >
                                    <span className="btn btn-square__text">
                                        {isModifyPage
                                            ? "회원정보 수정"
                                            : "가입하기"}
                                    </span>
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
                {isModifyPage ? (
                    <div className="join__row join__row--mt20">
                        <div className="join__button">
                            <button
                                type="button"
                                className="btn btn-square btn-square--xs"
                            >
                                <span className="btn btn-square__text">
                                    회원탈퇴
                                </span>
                            </button>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default JoinForm;
