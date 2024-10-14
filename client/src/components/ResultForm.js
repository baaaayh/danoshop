import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styles from './ResultForm.module.scss';

function ResultForm() {
    const location = useLocation();
    const { joinType, userId, userName, phone, email, birth, recommand, grade } = location.state.info;

    return (
        <div className={styles['join-result']}>
            <div className={styles['join-result__inner']}>
                <div className={styles['join-result__view']}>
                    <div className={styles['join-result__icon']}>
                        <img src="/images/icons/icon_joincomplete.svg" alt="" />
                    </div>
                    <div className={styles['join-result__title']}>
                        <h3>회원가입이 완료 되었습니다.</h3>
                    </div>
                    <div className={styles['join-result__text']}>
                        <ul>
                            <li>
                                <b>{userName}</b> 님은 <b>{grade}</b> 회원이십니다.
                            </li>
                            <li>{`${''} 구매시 ${''}을 추가적립 받으실 수 있습니다.`}</li>
                        </ul>
                    </div>
                    <div className={styles['join-result__info']}>
                        <ul>
                            <li>
                                <span>아이디</span>
                                {userId}
                            </li>
                            <li>
                                <span>이름</span>
                                {userName}
                            </li>
                            <li>
                                <span>이메일</span>
                                {email}
                            </li>
                        </ul>
                    </div>
                </div>
                <div className={styles['join-result__button']}>
                    <Link to="/" className="btn btn-square btn-square--white">
                        <span className="btn btn-square__text">메인으로 이동</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ResultForm;
