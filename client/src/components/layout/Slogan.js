import React from "react";
import { Link } from "react-router-dom";
import styles from "./Slogan.module.scss";

function Slogan() {
    return (
        <section className="section section--slogan">
            <div className="section__inner">
                <div className={styles.slogan}>
                    <h2>HEALTHY CAN BE EASY!</h2>
                    <p>
                        식단관리식은 어째서 비싸고, 맛없고, 양 적고
                        <br />
                        귀찮고 복잡한 것이 되었을까요? <br />
                        DANO는 '맛있고 간편한 건강식'을 개발합니다.
                        <br />
                        <br />
                        DANO의 깐깐한 기준으로
                        <br />
                        나와 내 가족이 먹고 쓸 제품을 만듭니다.
                        <br />
                        우리 제품이 더 건강한 몸, 더 행복한 삶을 만들 수 있다고
                        믿습니다.
                        <br />
                        <br />
                        당신의 더 나은 삶을 위한 DANO의 제품을 만나보세요.
                        <br />
                        <br />
                        <Link to="">회원가입</Link>
                    </p>
                </div>
            </div>
        </section>
    );
}

export default Slogan;
