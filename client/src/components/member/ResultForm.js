import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./ResultForm.module.scss";

function ResultForm({ userInfo }) {
    const location = useLocation();

    const [userDetail, setUserDetail] = useState({});
    const [userDetails, setUserDetails] = useState({}); // 상태로 관리할 userDetails 추가

    useEffect(() => {
        setUserDetail(userInfo);
    }, [userInfo]);

    useEffect(() => {
        const infoFromState = location.state?.info;
        const infoFromProps = userDetail;

        if (infoFromState) {
            const {
                joinType,
                userId,
                userName,
                phone,
                email,
                birth,
                recommand,
                grade,
            } = infoFromState;
            setUserDetails({
                joinType,
                userId,
                userName,
                phone,
                email,
                birth,
                recommand,
                grade,
            });
        } else if (infoFromProps) {
            const {
                joinType,
                userId,
                userName,
                phone,
                email,
                birth,
                recommand,
                grade,
            } = infoFromProps;
            setUserDetails({
                joinType,
                userId,
                userName,
                phone,
                email,
                birth,
                recommand,
                grade,
            });
        } else {
            setUserDetails({});
        }
    }, [location.state, userDetail]);

    return (
        <div className={`join-result ${styles["join-result"]}`}>
            <div className={styles["join-result__inner"]}>
                <div className={styles["join-result__view"]}>
                    <div className={styles["join-result__icon"]}>
                        <img src="/images/icons/icon_joincomplete.svg" alt="" />
                    </div>
                    {location.pathname === "/member/result" ? (
                        <>
                            <div className={styles["join-result__title"]}>
                                <h3>회원가입이 완료 되었습니다.</h3>
                            </div>
                            <div className={styles["join-result__text"]}>
                                <ul>
                                    <li>
                                        <b>{userDetails.userName}</b> 님은{" "}
                                        <b></b> 회원이십니다.
                                    </li>
                                    <li>{`${""} 구매시 ${""}을 추가적립 받으실 수 있습니다.`}</li>
                                </ul>
                            </div>
                            <div className={styles["join-result__info"]}>
                                <ul>
                                    <li>
                                        <span>아이디</span>
                                        {userDetails.userId}
                                    </li>
                                    <li>
                                        <span>이름</span>
                                        {userDetails.userName}
                                    </li>
                                    <li>
                                        <span>이메일</span>
                                        {userDetails.email}
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : null}
                    {location.pathname === "/member/modify" ? (
                        <>
                            <div className={styles["join-result__title"]}>
                                <h3>{`안녕하세요. ${userDetails.userName}님`}</h3>
                            </div>
                            <div
                                className={`${styles["join-result__text"]} ${styles["join-result__text--nobd"]}`}
                            >
                                <ul>
                                    <li>
                                        고객님의 회원등급은 <b>{}</b> 입니다.
                                    </li>
                                </ul>
                            </div>
                        </>
                    ) : null}
                </div>
                {location.pathname === "/member/result" ? (
                    <div className={styles["join-result__button"]}>
                        <Link
                            to="/"
                            className="btn btn-square btn-square--white"
                        >
                            <span className="btn btn-square__text">
                                메인으로 이동
                            </span>
                        </Link>
                    </div>
                ) : null}
            </div>
        </div>
    );
}

export default ResultForm;
